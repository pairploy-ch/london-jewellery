import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
} from "@/app/lib/site";
import { MAISONS } from "@/app/components/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  knowsAbout: [...MAISONS, "Fine jewellery authentication"],
};

// Public marketing site chrome (header + footer + organisation schema).
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
