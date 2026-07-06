"use client";

import { useState } from "react";
import { ASSESSMENT_FEE } from "./content";
import { TermsModal } from "./terms-modal";
import type { SubmissionDetails } from "./photos-step";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="eyebrow text-muted">{label}</span>
      <span className="font-serif text-lg text-ink">{value}</span>
    </div>
  );
}

export function PaymentStep({
  details,
  onSkipPreview,
}: {
  details: SubmissionDetails;
  onSkipPreview: () => void;
}) {
  const [accepted, setAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function proceed() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      if (res.status === 503) {
        // Stripe not configured yet → preview mode.
        setNotConfigured(true);
        setSubmitting(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "checkout_failed");
      }

      // Hand off to Stripe-hosted Checkout.
      window.location.href = data.url;
    } catch {
      setError("Unable to start payment. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="font-display text-3xl md:text-4xl">Accept &amp; pay</h2>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        Review your assessment and accept our terms to continue to secure
        payment by card. Your report is returned by email within 48 hours.
      </p>

      {/* order summary */}
      <div className="mt-8 border border-line bg-cream-deep/40 p-6">
        <SummaryRow label="Brand" value={details.brand || "—"} />
        <SummaryRow label="Item type" value={details.itemType || "—"} />
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <span className="eyebrow text-ink">Assessment fee</span>
          <span className="font-display text-2xl text-ink">
            {ASSESSMENT_FEE.label}
          </span>
        </div>
      </div>

      {/* terms gate */}
      <div className="mt-8 flex items-start gap-3">
        <input
          id="accept-terms"
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#a4854f]"
        />
        <label
          htmlFor="accept-terms"
          className="cursor-pointer font-serif text-base leading-relaxed text-ink-soft"
        >
          I accept the{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTermsOpen(true);
            }}
            className="text-gold underline underline-offset-2 hover:text-gold-soft"
          >
            Terms &amp; Disclaimer
          </button>{" "}
          and understand that this online assessment provides a preliminary
          professional opinion based solely on the visual evidence from the
          photographs provided.
        </label>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* payment action */}
      {!notConfigured ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={proceed}
            disabled={!accepted || submitting}
            className="eyebrow inline-flex w-full items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {submitting ? "Redirecting…" : `Proceed to secure payment · ${ASSESSMENT_FEE.label}`}
          </button>
          <p className="mt-3 text-center font-serif text-sm text-muted">
            You will be redirected to our secure payment provider, Stripe.
          </p>
          {error ? (
            <p className="mt-4 font-serif text-base text-[#b3261e]">{error}</p>
          ) : null}
        </div>
      ) : (
        // Preview mode — Stripe not configured yet
        <div className="mt-8">
          <p className="border-l-2 border-gold bg-gold/5 p-4 font-serif text-base leading-relaxed text-ink-soft">
            Payment is not configured yet. Add your Stripe keys to{" "}
            <code className="font-sans text-sm">.env.local</code> to enable
            secure card payment via Stripe Checkout.
          </p>
          <button
            type="button"
            onClick={onSkipPreview}
            disabled={!accepted}
            className="eyebrow mt-4 inline-flex w-full items-center justify-center border border-line-dark px-8 py-4 text-ink transition-colors hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            Skip to photos (preview) →
          </button>
        </div>
      )}
    </>
  );
}
