import type { Metadata } from "next";
import {
  PageHero,
  SectionLabel,
  CtaSection,
  ImagePlate,
} from "@/app/components/ui";
import { MAISONS } from "@/app/components/content";

export const metadata: Metadata = {
  title: "Services",
  alternates: { canonical: "/services" },
  description:
    "Independent written assessments for branded fine jewellery — authentication opinions and guidance for buyers, sellers, insurers and private clients.",
};

const SERVICES = [
  {
    no: "01",
    title: "Brand Authentication Opinion",
    body: "An independent written opinion on whether a piece is consistent with the maison's craftsmanship, hallmarks and documentation.",
  },
  {
    no: "02",
    title: "Buyer Guidance",
    body: "Pre-purchase confidence for collectors and private buyers considering a piece on the primary or secondary market.",
  },
  {
    no: "03",
    title: "Seller Guidance",
    body: "Present your piece accurately and credibly when selling, consigning or passing it on.",
  },
  {
    no: "04",
    title: "Insurance & Estate Context",
    body: "Written context to support insurers, estates and private records. This is an opinion, not an official valuation.",
  },
  {
    no: "05",
    title: "Private Client Consultation",
    body: "Discreet, independent advice on an individual piece — unaffiliated with any house or retailer.",
  },
];

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Our Services"
        title="Independent assessment, in writing."
        intro="Written guidance for buyers, sellers, insurers and private clients — never affiliated with the maisons or retailers."
      />

      {/* What we offer */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>What We Offer</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
          A focused set of services.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.no} className="bg-cream p-8 md:p-10">
              <span className="font-display text-3xl text-gold md:text-4xl">
                {s.no}
              </span>
              <h3 className="mt-5 font-display text-xl md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink-soft md:text-lg">
                {s.body}
              </p>
            </div>
          ))}
          {/* trailing image plate to balance the odd grid on desktop */}
          <ImagePlate
            caption="By appointment · London"
            className="hidden min-h-[220px] md:block"
          />
        </div>
      </section>

      {/* Houses reviewed */}
      <section className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
          <SectionLabel>Houses We Review</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            Six maisons, reviewed in depth.
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
            We deliberately limit our scope so that every assessment is grounded
            in deep familiarity with each house.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
            {MAISONS.map((m) => (
              <li
                key={m}
                className="flex min-h-[110px] items-center bg-cream-deep px-6 py-8 font-display text-2xl text-ink md:text-3xl"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Selective approach */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>A Selective Assessment Approach</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
          The right method for each piece.
        </h2>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
          For certain diamonds and gemstones, we do not offer photo-based online
          assessments, as no high-value item is suitable without in-person
          examination to ensure the highest level of accuracy and professional
          judgement. In these cases, we will let you know and recommend the
          appropriate next step.
        </p>

        <figure className="mt-12 border-l-2 border-gold pl-6 md:mt-16 md:pl-10">
          <blockquote className="max-w-3xl font-display text-2xl italic leading-snug text-ink md:text-4xl">
            &ldquo;Each piece deserves the right examination method — and the
            right photographs rarely tell the whole story of a gemstone.&rdquo;
          </blockquote>
        </figure>
      </section>

      <CtaSection />
    </main>
  );
}
