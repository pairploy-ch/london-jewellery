import { NextResponse } from "next/server";
import { createAdminClient } from "../../lib/supabase/admin";
import {
  isSupabaseAdminConfigured,
  PHOTO_BUCKET,
} from "../../lib/supabase/config";
import { getStripe, isStripeConfigured } from "../../lib/stripe";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 10;

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    // Not wired to storage yet — let the client treat this as a preview.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const form = await request.formData();
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const photos = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (photos.length < MIN_PHOTOS || photos.length > MAX_PHOTOS) {
    return NextResponse.json({ error: "invalid_photos" }, { status: 400 });
  }

  // Verify the payment really succeeded before recording anything.
  const paymentIntentId = field("paymentIntentId");
  let payment_status: string | null = null;
  let amount: number | null = null;
  let currency: string | null = null;

  if (paymentIntentId && isStripeConfigured()) {
    try {
      const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== "succeeded") {
        return NextResponse.json(
          { error: "payment_incomplete" },
          { status: 402 },
        );
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
  // succeeded (see /api/checkout-status) — this just attaches photos to it.
  // The insert path below only runs as a fallback (e.g. local preview mode
  // with Stripe unconfigured, where checkout never happened).
  const submissionId = field("submissionId");
  let rowId: string;
  let referenceNumber = "";

  if (submissionId) {
    const { data: existing, error: fetchError } = await admin
      .from("submissions")
      .select("id, reference_number")
      .eq("id", submissionId)
      .single();
    if (fetchError || !existing) {
      return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
    }
    rowId = existing.id;
    referenceNumber = existing.reference_number ?? "";
  } else {
    const hasGemstones = field("hasGemstones");
    const { data: inserted, error: insertError } = await admin
      .from("submissions")
      .insert({
        name: field("name"),
        email: field("email"),
        phone: field("phone") || null,
        country: field("country") || null,
        address: field("address") || null,
        brand: field("brand") || null,
        item_type: field("itemType") || null,
        metal: field("metal") || null,
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
    rowId = inserted.id;
    referenceNumber = inserted.reference_number ?? "";
  }

  // Upload photos into a folder named after the submission id.
  const paths: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const file = photos[i];
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${rowId}/${i + 1}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(PHOTO_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (!uploadError) paths.push(path);
  }

  await admin
    .from("submissions")
    .update({ photo_paths: paths })
    .eq("id", rowId);

  return NextResponse.json({ ok: true, id: rowId, referenceNumber });
}
