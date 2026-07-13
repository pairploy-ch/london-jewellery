import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import {
  isSupabaseConfigured,
  PHOTO_BUCKET,
  type Submission,
} from "../../lib/supabase/config";
import { ReportForm } from "./report-form";

export const metadata: Metadata = {
  title: "Submission — Admin",
  robots: { index: false, follow: false },
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="eyebrow w-44 shrink-0 text-muted">{label}</span>
      <span className="font-serif text-lg text-ink">{value || "—"}</span>
    </div>
  );
}

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();
  const s = data as Submission;

  // sign each photo for temporary viewing (private bucket)
  const photoUrls: string[] = [];
  for (const path of s.photo_paths ?? []) {
    const { data: signed } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrl(path, 60 * 60);
    if (signed?.signedUrl) photoUrls.push(signed.signedUrl);
  }

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-4xl px-5 py-12 md:px-10 md:py-16">
        <Link
          href="/admin"
          className="eyebrow text-muted transition-colors hover:text-ink"
        >
          ← All submissions
        </Link>

        <h1 className="mt-6 font-display text-4xl md:text-5xl">{s.name}</h1>
        <p className="mt-2 font-serif text-lg text-ink-soft">
          {s.brand ?? "—"} · {s.item_type ?? "—"}
        </p>

        <div className="mt-10">
          <DetailRow label="Email" value={s.email} />
          <DetailRow label="Phone" value={s.phone ?? ""} />
          <DetailRow label="Country" value={s.country ?? ""} />
          <DetailRow label="Address" value={s.address ?? ""} />
          <DetailRow label="Brand" value={s.brand ?? ""} />
          <DetailRow label="Item type" value={s.item_type ?? ""} />
          <DetailRow label="Metal" value={s.metal ?? ""} />
          <DetailRow
            label="Diamonds / gemstones"
            value={
              s.has_gemstones === null ? "" : s.has_gemstones ? "Yes" : "No"
            }
          />
          <DetailRow label="Payment status" value={s.payment_status ?? ""} />
          <DetailRow
            label="Amount"
            value={
              s.amount != null
                ? `${(s.amount / 100).toFixed(2)} ${(
                    s.currency ?? ""
                  ).toUpperCase()}`
                : ""
            }
          />
          <DetailRow
            label="Payment reference"
            value={s.payment_intent_id ?? ""}
          />
          <DetailRow label="Status" value={s.status} />
        </div>

        <h2 className="mt-12 font-display text-2xl md:text-3xl">
          Photographs ({photoUrls.length})
        </h2>
        {photoUrls.length === 0 ? (
          <p className="mt-4 font-serif text-lg text-muted">
            No photographs attached.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photoUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <a key={i} href={url} target="_blank" rel="noreferrer">
                <img
                  src={url}
                  alt={`Submission photo ${i + 1}`}
                  className="aspect-square w-full object-cover ring-1 ring-line transition-opacity hover:opacity-90"
                />
              </a>
            ))}
          </div>
        )}

        <h2 className="mt-12 font-display text-2xl md:text-3xl">
          Assessment Report
        </h2>
        <ReportForm
          submissionId={s.id}
          clientEmail={s.email}
          defaults={{
            referenceNumber: s.id.slice(0, 8).toUpperCase(),
            brand: s.brand ?? "",
            itemType: s.item_type ?? "",
          }}
          reportSentAt={s.report_sent_at}
        />
      </section>
    </main>
  );
}
