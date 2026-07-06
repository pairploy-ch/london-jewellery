import type { Metadata } from "next";
import { PageHero } from "@/app/components/ui";
import { LegalBody } from "@/app/components/legal";
import { TERMS } from "@/app/components/content";

export const metadata: Metadata = {
  title: "Terms & Disclaimer",
  alternates: { canonical: "/terms" },
  description:
    "The terms and disclaimer governing London Jewellery Consult's independent, visual-based online assessment services.",
};

export default function TermsPage() {
  return (
    <main className="flex-1">
      <PageHero eyebrow="Legal" title="Terms & Disclaimer" />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
        <LegalBody intro={TERMS.intro} sections={TERMS.sections} />
      </section>
    </main>
  );
}
