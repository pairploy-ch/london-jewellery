import type { Metadata } from "next";
import { Eyebrow, Button, ImagePlate, SectionLabel } from "@/app/components/ui";
import { MAISONS, STEPS, OUTCOMES } from "@/app/components/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="top" className="flex-1">
      {/* Hero */}
      <section className="relative bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
          <Eyebrow>Independent Jewellery Authentication · Consultation</Eyebrow>
          <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Expertise.
            <br />
            Integrity.
            <br />
            Reliability.
          </h1>
          <p className="mt-8 max-w-md font-serif text-xl font-light text-cream/70 md:text-2xl">
            An independent consultancy for branded fine jewellery.
          </p>
          <div className="mt-10">
            <Button>Begin an Assessment</Button>
          </div>
        </div>

        {/* hero image */}
        <ImagePlate
          caption="Independent · Experienced"
          className="h-72 w-full md:h-[420px]"
        />
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>Independent · Experienced</SectionLabel>
        <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
          An independent consultancy for branded fine jewellery.
        </h2>
        <div className="mt-8 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
          <p>
            London Jewellery Consultant is an independent consultancy for branded
            fine jewellery — Cartier, Van Cleef &amp; Arpels, Tiffany &amp; Co.,
            Bvlgari, Chopard and Chanel.
          </p>
          <p>
            We provide written guidance for buyers, sellers, insurers and private
            clients, who are not affiliated with any of the maisons and retailers.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-8">
          {MAISONS.map((m) => (
            <li key={m} className="font-display text-lg text-ink/80 md:text-xl">
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* Selective approach + pull quote */}
      <section className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
          <SectionLabel>A Selective Assessment Approach</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            A selective assessment approach.
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
        </div>
      </section>

      {/* The process */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>The Process</SectionLabel>
        <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
          How it works.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.no} className="bg-cream p-8 md:p-10">
              <span className="font-display text-4xl text-gold md:text-5xl">
                {s.no}
              </span>
              <h3 className="mt-6 font-display text-xl md:text-2xl">{s.title}</h3>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink-soft md:text-lg">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
          <SectionLabel>Assessment Outcomes</SectionLabel>
          <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
            Three possible outcomes.
          </h2>

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

      {/* CTA */}
      <section id="assessment" className="relative bg-ink-soft text-cream">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-10 md:py-28">
          <Eyebrow>Get in Touch</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            Ready for an independent opinion?
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg text-cream/70 md:text-xl">
            Submit your details and we will respond with a written assessment by
            email within 48 hours.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button>Begin an Assessment</Button>
            <Button variant="outline" href="#enquiry">
              Make an Enquiry
            </Button>
          </div>
        </div>
      </section>

      {/* Please read */}
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
    </main>
  );
}
