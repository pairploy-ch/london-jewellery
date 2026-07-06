import type { Metadata } from "next";
import { PageHero } from "@/app/components/ui";
import { LegalBody } from "@/app/components/legal";
import { PRIVACY } from "@/app/components/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description:
    "How London Jewellery Consult collects, uses and safeguards your personal data under the UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
        <LegalBody intro={PRIVACY.intro} sections={PRIVACY.sections} />
      </section>
    </main>
  );
}
