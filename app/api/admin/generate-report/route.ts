import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { createAdminClient } from "../../../lib/supabase/admin";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import type { ReportData, ReportResult } from "../../../lib/supabase/config";
import { buildReportHtml } from "../../../lib/report-template";
import { htmlToPdf } from "../../../lib/pdf";
import { sendReportEmail } from "../../../lib/email";

const RESULTS: ReportResult[] = ["verified", "unable", "more_info"];

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // Only signed-in admins may generate and send reports.
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

  if (!report.referenceNumber || !report.dateOfAssessment) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: submission, error: fetchError } = await admin
    .from("submissions")
    .select("id, name, email")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
  }

  let pdf: Buffer;
  try {
    const html = buildReportHtml(report);
    pdf = await htmlToPdf(html);
  } catch (err) {
    console.error("report PDF generation failed", err);
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  }

  const sent = await sendReportEmail({
    to: submission.email,
    name: submission.name,
    orderRef: report.referenceNumber,
    pdf,
  });
  if (!sent) {
    return NextResponse.json({ error: "email_failed" }, { status: 502 });
  }

  const { error: updateError } = await admin
    .from("submissions")
    .update({
      report,
      report_sent_at: new Date().toISOString(),
      status: "complete",
    })
    .eq("id", submissionId);

  if (updateError) {
    console.error("report status update failed", updateError);
    // Email already sent to the client — surface a distinct error so the
    // admin knows the report went out even though we couldn't record it.
    return NextResponse.json({ error: "sent_but_not_saved" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
