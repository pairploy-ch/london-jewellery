import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { isSupabaseAdminConfigured } from "../../../lib/supabase/config";
import { getStripe, isStripeConfigured } from "../../../lib/stripe";

/* Step 1 of the (now 3-request) submit flow — verifies payment and ensures a
   submission row exists, returning its id so the browser can upload photos
   straight to Storage next. Kept as its own JSON-only request (no file
   bytes) so it's unaffected by Vercel's ~4.5MB function body limit. */
export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const str = (k: string) => {
    const v = body[k];
    return typeof v === "string" ? v.trim().slice(0, 200) : "";
  };

  const paymentIntentId = str("paymentIntentId");
  const submissionId = str("submissionId");

  let payment_status: string | null = null;
  let amount: number | null = null;
  let currency: string | null = null;

  if (paymentIntentId && isStripeConfigured()) {
    try {
      const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== "succeeded") {
        return NextResponse.json({ error: "payment_incomplete" }, { status: 402 });
      }
      payment_status = pi.status;
      amount = pi.amount;
      currency = pi.currency;
    } catch {
      return NextResponse.json({ error: "payment_unverified" }, { status: 402 });
    }
  }

  const admin = createAdminClient();

  // The order record is normally created already, the moment payment
  // succeeded (see /api/checkout-status) — this just confirms it. The
  // insert path below only runs as a fallback (e.g. local preview mode with
  // Stripe unconfigured, where checkout never happened).
  if (submissionId) {
    const { data: existing, error: fetchError } = await admin
      .from("submissions")
      .select("id, reference_number")
      .eq("id", submissionId)
      .single();
    if (fetchError || !existing) {
      return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
    }
    return NextResponse.json({
      id: existing.id,
      referenceNumber: existing.reference_number ?? "",
    });
  }

  const hasGemstones = str("hasGemstones");
  const { data: inserted, error: insertError } = await admin
    .from("submissions")
    .insert({
      name: str("name"),
      email: str("email"),
      phone: str("phone") || null,
      country: str("country") || null,
      address: str("address") || null,
      brand: str("brand") || null,
      item_type: str("itemType") || null,
      metal: str("metal") || null,
      has_gemstones:
        hasGemstones === "yes" ? true : hasGemstones === "no" ? false : null,
      payment_intent_id: paymentIntentId || null,
      payment_status,
      amount,
      currency,
    })
    .select("id, reference_number")
    .single();

  if (insertError || !inserted) {
    console.error("submission insert failed", insertError);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({
    id: inserted.id,
    referenceNumber: inserted.reference_number ?? "",
  });
}
