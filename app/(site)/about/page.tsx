import type { Metadata } from "next";
import {
  PageHero,
  SectionLabel,
  CtaSection,
  ImagePlate,
} from "@/app/components/ui";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "An independent consultancy for branded fine jewellery. We provide written guidance unaffiliated with any maison or retailer — built on expertise, integrity and reliability.",
};

const VALUES = [
  {
    title: "Expertise",
    body: "Deep, focused familiarity with six houses — the craftsmanship, hallmarks and documentation that define each.",
  },
  {
    title: "Integrity",
    body: "Independent and unaffiliated. Our only obligation is an honest, considered opinion for the client in front of us.",
  },
  {
    title: "Reliability",
    body: "A clear written assessment within 48 hours, with transparent limits on what a photo-based review can conclude.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="About"
        title="Independent. Experienced."
        intro="An independent consultancy for branded fine jewellery."
      />

      {/* Intro image + copy */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <ImagePlate
            caption="London, UK"
            className="h-64 w-full md:h-[380px]"
          />
          <div>
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
              An independent consultancy for branded fine jewellery.
            </h2>
            <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
              <p>
                London Jewellery Consultant is an independent consultancy for
                branded fine jewellery — Cartier, Van Cleef &amp; Arpels, Tiffany
                &amp; Co., Bvlgari, Chopard and Chanel.
              </p>
              <p>
                We provide written guidance for buyers, sellers, insurers and
                private clients, who are not affiliated with any of the maisons
                and retailers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
          <SectionLabel>What We Stand For</SectionLabel>
          <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            Expertise. Integrity. Reliability.
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-cream-deep p-8 md:p-10">
                <h3 className="font-display text-2xl text-ink md:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-4 font-serif text-base leading-relaxed text-ink-soft md:text-lg">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selective approach + quote */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>A Selective Assessment Approach</SectionLabel>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
          For certain diamonds and gemstones, we do not offer photo-based online
          assessments, as no high-value item is suitable without in-person
          examination. In these cases, we will let you know and recommend the
          appropriate next step.
        </p>

        <figure className="mt-12 border-l-2 border-gold pl-6 md:mt-16 md:pl-10">
          <blockquote className="max-w-3xl font-display text-2xl italic leading-snug text-ink md:text-4xl">
            &ldquo;Each piece deserves the right examination method — and the
            right photographs rarely tell the whole story of a gemstone.&rdquo;
          </blockquote>
        </figure>
      </section>

      {/* Disclaimer */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
          <SectionLabel>Please Note</SectionLabel>
          <div className="mt-8 max-w-2xl space-y-5 font-serif text-base leading-relaxed text-cream/70 md:text-lg">
            <p>
              A Jewellery Assessment Report is an independent written opinion. It
              is not an official brand certificate, and is not issued by Cartier,
              Van Cleef &amp; Arpels, Tiffany &amp; Co., Bvlgari, Chopard, Chanel
              or any other house.
            </p>
            <p>
              We review six houses only, and do not assess pieces with diamonds or
              coloured gemstones from photographs alone. For a definitive
              conclusion, an in-person inspection is always preferable.
            </p>
          </div>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
