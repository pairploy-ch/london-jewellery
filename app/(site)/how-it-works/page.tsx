import type { Metadata } from "next";
import { PageHero, SectionLabel, CtaSection } from "@/app/components/ui";
import { STEPS, OUTCOMES } from "@/app/components/content";

export const metadata: Metadata = {
  title: "How It Works",
  alternates: { canonical: "/how-it-works" },
  description:
    "Our process: submit your details, an eligibility check, then secure payment — followed by a written assessment with one of three clear outcomes.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="The Process"
        title="How it works."
        intro="A clear, considered path from enquiry to written assessment."
      />

      {/* Steps — vertical on mobile, three columns on desktop */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>Three Simple Steps</SectionLabel>
        <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
          From enquiry to opinion.
        </h2>

        <ol className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.no} className="bg-cream p-8 md:p-10">
              <span className="font-display text-4xl text-gold md:text-5xl">
                {s.no}
              </span>
              <h3 className="mt-6 font-display text-xl md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink-soft md:text-lg">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Outcomes */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
          <SectionLabel>Assessment Outcomes</SectionLabel>
          <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            Three possible outcomes.
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-cream/70 md:text-xl">
            Every assessment concludes with one of three clear outcomes, so you
            always know where the piece stands.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden border border-line-dark bg-line-dark md:grid-cols-3">
            {OUTCOMES.map((o) => (
              <div key={o.no} className="bg-ink p-8 md:p-10">
                <span className="font-display text-4xl text-gold-soft md:text-5xl">
                  {o.no}
                </span>
                <h3 className="mt-6 font-display text-xl md:text-2xl">
                  {o.title}
                </h3>
                <p className="mt-3 font-serif text-base leading-relaxed text-cream/60 md:text-lg">
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before you submit */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
        <SectionLabel>Please Read</SectionLabel>
        <h2 className="mt-6 font-display text-2xl leading-tight md:text-4xl">
          Before you submit a piece.
        </h2>
        <div className="mt-8 max-w-2xl space-y-5 font-serif text-base leading-relaxed text-ink-soft md:text-lg">
          <p>
            Each review is based on the images and details you send us. Image
            quality, angles and completeness affect what we can say.
          </p>
          <p>
            A Jewellery Assessment Report is an independent written opinion. It is
            not an official brand certificate, and is not issued by Cartier, Van
            Cleef &amp; Arpels, Tiffany &amp; Co., Bvlgari, Chopard, Chanel or any
            other house.
          </p>
          <p>
            Photo-based review has limits. For a definitive conclusion, an
            in-person inspection is always preferable.
          </p>
          <p>
            We review six houses only — Cartier, Van Cleef &amp; Arpels, Tiffany
            &amp; Co., Bvlgari, Chopard and Chanel — and do not assess pieces with
            diamonds or coloured gemstones from photographs alone.
          </p>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
