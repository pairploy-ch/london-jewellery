"use client";

import { useState } from "react";
import type { ReportData, ReportResult } from "../../lib/supabase/config";

const RESULT_OPTIONS: { value: ReportResult; label: string }[] = [
  { value: "verified", label: "Verified" },
  { value: "unable", label: "Unable to Verify" },
  { value: "more_info", label: "Further Information Required" },
];

const fieldClass =
  "mt-2 w-full border-b border-line bg-transparent pb-2 font-serif text-base text-ink outline-none transition-colors focus:border-gold";

function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ReportForm({
  submissionId,
  clientEmail,
  defaults,
  reportSentAt,
}: {
  submissionId: string;
  clientEmail: string;
  defaults: {
    referenceNumber: string;
    brand: string;
    itemType: string;
  };
  reportSentAt: string | null;
}) {
  const [fields, setFields] = useState<ReportData>({
    referenceNumber: defaults.referenceNumber,
    dateOfAssessment: todayISO(),
    brand: defaults.brand,
    itemType: defaults.itemType,
    collection: "",
    material: "",
    serial: "",
    additionalDetails: "",
    result: "verified",
    notes: "",
  });
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState(reportSentAt);

  const set = (key: keyof ReportData) => (v: string) =>
    setFields((f) => ({ ...f, [key]: v }));

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirming(true);
  }

  async function handleConfirmSend() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, ...fields }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "generate_failed");
      setSentAt(new Date().toISOString());
      setConfirming(false);
    } catch {
      setError("Something went wrong generating or sending the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirming) {
    const resultLabel = RESULT_OPTIONS.find((o) => o.value === fields.result)?.label;
    return (
      <div className="mt-6 border border-line bg-cream p-6 md:p-8">
        <h3 className="font-display text-2xl">Confirm &amp; send report</h3>
        <p className="mt-4 font-serif text-lg text-ink-soft">
          This will generate a PDF report and email it to{" "}
          <span className="text-ink">{clientEmail}</span>. Please confirm the
          details below before sending.
        </p>

        <div className="mt-6 space-y-3 border-t border-line pt-6 font-serif text-base text-ink-soft">
          <p><span className="eyebrow text-ink/70">Reference — </span>{fields.referenceNumber}</p>
          <p><span className="eyebrow text-ink/70">Date — </span>{fields.dateOfAssessment}</p>
          <p><span className="eyebrow text-ink/70">Brand / Item — </span>{fields.brand} · {fields.itemType}</p>
          <p><span className="eyebrow text-ink/70">Result — </span>{resultLabel}</p>
          {fields.notes.trim() ? (
            <p className="whitespace-pre-wrap">
              <span className="eyebrow text-ink/70">Notes — </span>{fields.notes}
            </p>
          ) : null}
        </div>

        {error ? (
          <p className="mt-4 font-serif text-base text-[#b3261e]">{error}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleConfirmSend}
            disabled={submitting}
            className="eyebrow inline-flex items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {submitting ? "Generating & sending…" : `Send to ${clientEmail}`}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={submitting}
            className="eyebrow inline-flex items-center justify-center border border-line-dark px-8 py-4 text-ink transition-colors hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back to edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleReviewSubmit}
      className="mt-6 border border-line bg-cream p-6 md:p-8"
    >
      {sentAt ? (
        <p className="mb-6 border-l-2 border-gold bg-gold/5 p-4 font-serif text-base text-ink-soft">
          Report sent to the client on{" "}
          {new Date(sentAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          . Submitting again will generate and send an updated report.
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-ink/70">Reference Number</span>
          <input
            className={fieldClass}
            value={fields.referenceNumber}
            onChange={(e) => set("referenceNumber")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Date of Assessment</span>
          <input
            type="date"
            className={fieldClass}
            value={fields.dateOfAssessment}
            onChange={(e) => set("dateOfAssessment")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Brand Submitted</span>
          <input
            className={fieldClass}
            value={fields.brand}
            onChange={(e) => set("brand")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Item Type</span>
          <input
            className={fieldClass}
            value={fields.itemType}
            onChange={(e) => set("itemType")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Collection</span>
          <input
            className={fieldClass}
            placeholder="Optional"
            value={fields.collection}
            onChange={(e) => set("collection")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Material</span>
          <input
            className={fieldClass}
            placeholder="Optional"
            value={fields.material}
            onChange={(e) => set("material")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Serial / Marking</span>
          <input
            className={fieldClass}
            placeholder="Optional"
            value={fields.serial}
            onChange={(e) => set("serial")(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/70">Additional Details</span>
          <input
            className={fieldClass}
            placeholder="Optional"
            value={fields.additionalDetails}
            onChange={(e) => set("additionalDetails")(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-8">
        <span className="eyebrow text-ink/70">Assessment Result</span>
        <div className="mt-3 flex flex-col gap-3">
          {RESULT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-3 font-serif text-base text-ink"
            >
              <input
                type="radio"
                name="result"
                value={opt.value}
                checked={fields.result === opt.value}
                onChange={() => set("result")(opt.value)}
                className="h-4 w-4 accent-[#a4854f]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <label className="mt-8 block">
        <span className="eyebrow text-ink/70">Expert Observations &amp; Notes</span>
        <textarea
          className={`${fieldClass} min-h-32 resize-y`}
          placeholder="Optional — free text shown on the report"
          value={fields.notes}
          onChange={(e) => set("notes")(e.target.value)}
        />
      </label>

      {error ? (
        <p className="mt-4 font-serif text-base text-[#b3261e]">{error}</p>
      ) : null}

      <button
        type="submit"
        className="eyebrow mt-8 inline-flex w-full items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft sm:w-auto"
      >
        Review &amp; Send Report
      </button>
    </form>
  );
}
