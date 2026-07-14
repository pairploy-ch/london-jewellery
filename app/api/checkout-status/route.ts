import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "../../lib/stripe";
import { sendPaymentConfirmationEmail } from "../../lib/email";
import { createAdminClient } from "../../lib/supabase/admin";
import { isSupabaseAdminConfigured } from "../../lib/supabase/config";

/* Finds the submission row for this payment, creating it if this is the
   first time we've seen it. Runs on every payment success — the unique
   index on payment_intent_id makes concurrent calls (page reloads) race-safe. */
async function findOrCreateSubmission(
  paymentIntentId: string,
  metadata: Record<string, string>,
  payment: { status: string; amount: number; currency: string },
): Promise<{ id: string; referenceNumber: string } | null> {
  if (!isSupabaseAdminConfigured()) return null;
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("submissions")
    .select("id, reference_number")
    .eq("payment_intent_id", paymentIntentId)
    .maybeSingle();
  if (existing) {
    return { id: existing.id, referenceNumber: existing.reference_number ?? "" };
  }

  const hasGemstones = metadata.hasGemstones;
  const { data: inserted, error: insertError } = await admin
    .from("submissions")
    .insert({
      name: metadata.name || "",
      email: metadata.email || "",
      phone: metadata.phone || null,
      country: metadata.country || null,
      address: metadata.address || null,
      brand: metadata.brand || null,
      item_type: metadata.itemType || null,
      metal: metadata.metal || null,
      has_gemstones:
        hasGemstones === "yes" ? true : hasGemstones === "no" ? false : null,
      payment_intent_id: paymentIntentId,
      payment_status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
    })
    .select("id, reference_number")
    .single();

  if (inserted) {
    return { id: inserted.id, referenceNumber: inserted.reference_number ?? "" };
  }

  // Unique-violation race: another concurrent request inserted it first.
  if (insertError?.code === "23505") {
    const { data: raceRow } = await admin
      .from("submissions")
      .select("id, reference_number")
      .eq("payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (raceRow) {
      return { id: raceRow.id, referenceNumber: raceRow.reference_number ?? "" };
    }
  }

  console.error("submission create-on-payment failed", insertError);
  return null;
}

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ paid: false }, { status: 503 });
  }
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? "");
    const paid = session.payment_status === "paid";

    let submissionId = "";
    let referenceNumber = "";

    if (paid && paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Create the order record the moment payment succeeds — so a payment
      // can always be traced to an order, even if the customer never
      // finishes uploading photos.
      const submission = await findOrCreateSubmission(
        paymentIntentId,
        (session.metadata ?? {}) as Record<string, string>,
        { status: pi.status, amount: pi.amount, currency: pi.currency },
      );
      if (submission) {
        submissionId = submission.id;
        referenceNumber = submission.referenceNumber;
      }

      // Fire the payment confirmation email exactly once per payment — guarded
      // by a metadata flag on the PaymentIntent since this endpoint can be
      // polled/reloaded multiple times after the Stripe redirect.
      if (pi.metadata?.confirmation_email_sent !== "true") {
        const email = session.customer_details?.email || session.metadata?.email;
        if (email) await sendPaymentConfirmationEmail({ to: email, referenceNumber });
        await stripe.paymentIntents.update(paymentIntentId, {
          metadata: { ...pi.metadata, confirmation_email_sent: "true" },
        });
      }
    }

    return NextResponse.json({
      paid,
      paymentIntentId,
      submissionId,
      referenceNumber,
      details: session.metadata ?? {},
    });
  } catch (err) {
    console.error("checkout-status failed", err);
    return NextResponse.json({ paid: false, error: "lookup_failed" }, {
      status: 500,
    });
  }
}
