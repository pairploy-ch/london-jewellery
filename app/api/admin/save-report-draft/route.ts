import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import type { ReportData, ReportResult } from "../../../lib/supabase/config";

const RESULTS: ReportResult[] = ["verified", "unable", "more_info"];

/* Persists the admin's in-progress report fields as the client types, so
   notes/details survive a page reload even before the report is sent.
   Does not touch report_sent_at/status — that only happens on actual send. */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const submissionId = typeof body?.submissionId === "string" ? body.submissionId : "";
  if (!submissionId) {
    return NextResponse.json({ error: "missing_submission" }, { status: 400 });
  }

  const str = (k: string) => {
    const v = body?.[k];
    return typeof v === "string" ? v.trim() : "";
  };
  const result = RESULTS.includes(body?.result) ? (body.result as ReportResult) : "verified";

  const report: ReportData = {
    referenceNumber: str("referenceNumber"),
    dateOfAssessment: str("dateOfAssessment"),
    brand: str("brand"),
    itemType: str("itemType"),
    collection: str("collection"),
    material: str("material"),
    serial: str("serial"),
    additionalDetails: str("additionalDetails"),
    result,
    notes: str("notes"),
  };

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from("submissions")
    .update({ report })
    .eq("id", submissionId);

  if (updateError) {
    console.error("save-report-draft failed", updateError);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
