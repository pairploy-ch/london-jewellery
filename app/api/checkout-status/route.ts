import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "../../lib/stripe";
import { sendPaymentConfirmationEmail } from "../../lib/email";

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

    // Fire the payment confirmation email exactly once per payment — guarded
    // by a metadata flag on the PaymentIntent since this endpoint can be
    // polled/reloaded multiple times after the Stripe redirect.
    if (paid && paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.metadata?.confirmation_email_sent !== "true") {
        const email = session.customer_details?.email || session.metadata?.email;
        if (email) await sendPaymentConfirmationEmail({ to: email });
        await stripe.paymentIntents.update(paymentIntentId, {
          metadata: { ...pi.metadata, confirmation_email_sent: "true" },
        });
      }
    }

    return NextResponse.json({
      paid,
      paymentIntentId,
      details: session.metadata ?? {},
    });
  } catch (err) {
    console.error("checkout-status failed", err);
    return NextResponse.json({ paid: false, error: "lookup_failed" }, {
      status: 500,
    });
  }
}
