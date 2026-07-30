import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { isSupabaseAdminConfigured } from "../../../lib/supabase/config";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 10;

/* Step 3 of the submit flow — records the uploaded photo paths against the
   submission once every photo has finished uploading directly to Storage. */
export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const submissionId =
    typeof body.submissionId === "string" ? body.submissionId : "";
  const photoPaths = Array.isArray(body.photoPaths)
    ? body.photoPaths.filter((p: unknown): p is string => typeof p === "string")
    : [];

  if (!submissionId || photoPaths.length < MIN_PHOTOS || photoPaths.length > MAX_PHOTOS) {
    return NextResponse.json({ error: "invalid_photos" }, { status: 400 });
  }
  // every path must belong to this submission's own folder
  if (!photoPaths.every((p: string) => p.startsWith(`${submissionId}/`))) {
    return NextResponse.json({ error: "invalid_photos" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing, error: fetchError } = await admin
    .from("submissions")
    .select("id, reference_number")
    .eq("id", submissionId)
    .single();
  if (fetchError || !existing) {
    return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
  }

  const { error: updateError } = await admin
    .from("submissions")
    .update({ photo_paths: photoPaths })
    .eq("id", submissionId);
  if (updateError) {
    console.error("submission photo_paths update failed", updateError);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    id: existing.id,
    referenceNumber: existing.reference_number ?? "",
  });
}
