"use client";

import { useEffect } from "react";
import { LegalBody } from "./legal";
import { TERMS } from "./content";

export function TermsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // close on Escape and lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={TERMS.title}
    >
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl">{TERMS.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 md:px-8">
          <LegalBody intro={TERMS.intro} sections={TERMS.sections} />
        </div>

        <div className="border-t border-line px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="eyebrow inline-flex w-full items-center justify-center bg-gold px-8 py-3 text-cream transition-colors hover:bg-gold-soft sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
