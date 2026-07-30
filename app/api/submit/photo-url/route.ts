import { NextResponse } from "next/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { isSupabaseAdminConfigured, PHOTO_BUCKET } from "../../../lib/supabase/config";

const MAX_PHOTOS = 10;

/* Step 2 of the submit flow — issues a short-lived signed upload URL for one
   photo. The browser uploads the file bytes straight to Supabase Storage
   with this, never through our own serverless function. */
export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const submissionId =
    typeof body.submissionId === "string" ? body.submissionId : "";
  const index = Number(body.index);
  const rawExt = typeof body.ext === "string" ? body.ext : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) || "jpg";

  if (
    !submissionId ||
    !Number.isInteger(index) ||
    index < 1 ||
    index > MAX_PHOTOS
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing, error: fetchError } = await admin
    .from("submissions")
    .select("id")
    .eq("id", submissionId)
    .single();
  if (fetchError || !existing) {
    return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
  }

  const path = `${submissionId}/${index}.${ext}`;
  const { data, error } = await admin.storage
    .from(PHOTO_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    console.error("createSignedUploadUrl failed", error);
    return NextResponse.json({ error: "signed_url_failed" }, { status: 500 });
  }

  return NextResponse.json({ path: data.path, token: data.token });
}
