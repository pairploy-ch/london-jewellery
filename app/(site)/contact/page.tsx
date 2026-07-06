import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionLabel, Button } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with London Jewellery Consult — independent consultancy for branded fine jewellery. Written assessments returned by email within 48 hours.",
};

const DETAILS = [
  {
    label: "Email",
    value: "contact@londonjewelleryconsult.com",
    href: "mailto:contact@londonjewelleryconsult.com",
  },
  { label: "Location", value: "London, UK" },
  { label: "Response time", value: "Within 48 hours, by email" },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        intro="For enquiries about a piece or our assessment service, contact us directly — we respond to every message personally."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-28">
        <SectionLabel>How to Reach Us</SectionLabel>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {DETAILS.map((d) => (
            <div key={d.label} className="bg-cream p-8 md:p-10">
              <span className="eyebrow text-muted">{d.label}</span>
              {d.href ? (
                <a
                  href={d.href}
                  className="mt-4 block break-words font-display text-xl text-ink transition-colors hover:text-gold md:text-2xl"
                >
                  {d.value}
                </a>
              ) : (
                <p className="mt-4 font-display text-xl text-ink md:text-2xl">
                  {d.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-ink-soft md:text-xl">
          <p>
            To submit a piece for review, the quickest route is to begin an
            assessment — tell us about the item and we will confirm whether it
            falls within our scope before any payment.
          </p>
          <p>
            We review six houses only — Cartier, Van Cleef &amp; Arpels, Tiffany
            &amp; Co., Bvlgari, Chopard and Chanel — and do not assess pieces with
            diamonds or coloured gemstones from photographs alone.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href="/begin">Begin an Assessment</Button>
          <Link
            href="mailto:contact@londonjewelleryconsult.com"
            className="eyebrow inline-flex items-center justify-center border border-line px-8 py-4 text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Email Us
          </Link>
        </div>
      </section>
    </main>
  );
}
