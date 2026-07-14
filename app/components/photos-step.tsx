"use client";

import { useEffect, useState } from "react";
import { PHOTO_SLOTS } from "./content";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per image
const MIN_PHOTOS = 5;

type Photo = { file: File; url: string };

export type SubmissionDetails = {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  brand: string;
  itemType: string;
  metal: string;
  hasGemstones: string;
};

export function PhotosStep({
  details,
  paymentIntentId,
  submissionId,
  onSubmitted,
}: {
  details: SubmissionDetails;
  paymentIntentId: string;
  submissionId: string;
  onSubmitted: (referenceNumber: string) => void;
}) {
  const [slots, setSlots] = useState<(Photo | null)[]>(() =>
    Array(PHOTO_SLOTS.length).fill(null),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      slots.forEach((p) => p && URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setSlot(index: number, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files can be uploaded.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Each photo must be 10 MB or smaller.");
      return;
    }
    setError(null);
    setSlots((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!.url);
      next[index] = { file, url: URL.createObjectURL(file) };
      return next;
    });
  }

  function removeSlot(index: number) {
    setSlots((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!.url);
      next[index] = null;
      return next;
    });
    setError(null);
  }

  const count = slots.filter(Boolean).length;

  async function handleSubmit() {
    if (count < MIN_PHOTOS) {
      setError(
        "Please upload at least 5 photos from different angles before submitting your assessment.",
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(details).forEach(([k, v]) => fd.append(k, v ?? ""));
      fd.append("paymentIntentId", paymentIntentId);
      fd.append("submissionId", submissionId);
      slots.forEach((p, i) => {
        if (p) {
          fd.append("photos", p.file);
          fd.append("photoLabels", PHOTO_SLOTS[i].title);
        }
      });

      const res = await fetch("/api/submit", { method: "POST", body: fd });

      // 503 = backend not configured yet → treat as a preview completion.
      if (res.status === 503) {
        onSubmitted("");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "submit_failed");

      onSubmitted(data?.referenceNumber ?? "");
    } catch {
      setError("Something went wrong submitting your photos. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="font-display text-3xl md:text-4xl">Photographs</h2>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        Please provide the following photographs of your piece. The more detail
        you can capture, the more thorough our assessment can be.
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="eyebrow text-ink/70">Your photos</span>
        <span className="eyebrow text-muted">
          {count} / {PHOTO_SLOTS.length}
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PHOTO_SLOTS.map((slot, i) => {
          const photo = slots[i];
          const inputId = `photo-slot-${i}`;
          return (
            <li
              key={slot.no}
              className="flex gap-4 border border-line bg-cream p-4"
            >
              {/* thumbnail / upload control */}
              <div className="relative h-20 w-20 shrink-0">
                {photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={slot.title}
                      className="h-full w-full object-cover ring-1 ring-line"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      aria-label={`Remove ${slot.title}`}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-ink-soft"
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M2.5 2.5l7 7m0-7l-7 7"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor={inputId}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-cream-deep/30 text-gold transition-colors hover:border-gold/60"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </label>
                )}
                <input
                  id={inputId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setSlot(i, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* label */}
              <div className="min-w-0">
                <span className="eyebrow text-muted">{slot.no}</span>
                <h3 className="mt-1 font-display text-lg leading-tight">
                  {slot.title}
                </h3>
                <p className="mt-1 font-serif text-sm leading-snug text-ink-soft">
                  {slot.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p className="mt-4 font-serif text-base text-[#b3261e]">{error}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="eyebrow mt-8 inline-flex w-full items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {submitting ? "Submitting…" : "Submit for assessment"}
      </button>
    </>
  );
}
