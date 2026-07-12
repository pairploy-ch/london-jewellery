import type { Metadata } from "next";
import { AssessmentForm } from "@/app/components/assessment-form";
import { ASSESSMENT_FEATURES } from "@/app/components/content";

export const metadata: Metadata = {
  title: "Begin an Assessment",
  alternates: { canonical: "/begin" },
  description:
    "Tell us about your piece and submit your photographs for review. An independent digital assessment of branded fine jewellery, returned by email within 48 hours.",
};

/* icons for the reassurance cards — one per feature */
function ShieldIcon() {
  return (
    <svg
      width="26"
      height="30"
      viewBox="0 0 26 30"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <path
        d="M13 1.5L24 5.5V14C24 21 19.2 26 13 28.5C6.8 26 2 21 2 14V5.5L13 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L12 18L17.5 12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M14 7.5V14L18.5 17"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <rect
        x="3"
        y="12"
        width="18"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M7 12V8a5 5 0 0110 0v4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
      <path
        d="M12 19.5V22.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      width="26"
      height="30"
      viewBox="0 0 26 30"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <circle cx="13" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M9.5 11.5L12 14L17 8.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18L6 28L13 24.5L20 28L18 18"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURE_ICONS = [ShieldIcon, ClockIcon, LockIcon, BadgeIcon];

export default function BeginPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
        {/* intro */}
        <p className="mx-auto max-w-xl text-center font-serif text-xl font-light leading-relaxed text-ink-soft md:text-2xl">
          Tell us about your piece and submit your photographs for review. We
          will contact you with the next step.
        </p>

        {/* reassurance cards */}
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:mt-16 md:grid-cols-4">
          {ASSESSMENT_FEATURES.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div
                key={f.title}
                className="flex flex-col items-center bg-cream px-6 py-10 text-center md:py-12"
              >
                <Icon />
                <h3 className="mt-5 font-display text-lg leading-tight">
                  {f.title}
                </h3>
                <p className="eyebrow mt-3 text-muted">{f.body}</p>
              </div>
            );
          })}
        </div>

        {/* step indicator + step 1 form */}
        <div className="mt-16 md:mt-20">
          <AssessmentForm />
        </div>
      </section>
    </main>
  );
}
