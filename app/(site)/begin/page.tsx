import type { Metadata } from "next";
import { AssessmentForm } from "@/app/components/assessment-form";
import { ASSESSMENT_FEATURES } from "@/app/components/content";

export const metadata: Metadata = {
  title: "Begin an Assessment",
  alternates: { canonical: "/begin" },
  description:
    "Tell us about your piece and submit your photographs for review. An independent digital assessment of branded fine jewellery, returned by email within 48 hours.",
};

/* simple shield mark reused across the reassurance cards */
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
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:mt-16 md:grid-cols-4">
          {ASSESSMENT_FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center bg-cream px-6 py-8 text-center"
            >
              <ShieldIcon />
              <h3 className="mt-5 font-display text-lg leading-tight">
                {f.title}
              </h3>
              <p className="eyebrow mt-3 text-muted">{f.body}</p>
            </div>
          ))}
        </div>

        {/* step indicator + step 1 form */}
        <div className="mt-16 md:mt-20">
          <AssessmentForm />
        </div>
      </section>
    </main>
  );
}
