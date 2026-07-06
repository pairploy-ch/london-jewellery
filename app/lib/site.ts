/* Canonical site configuration used across metadata, sitemap and robots.
   Override the URL per environment with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.londonjewelleryconsult.com"
).replace(/\/$/, "");

export const SITE_NAME = "London Jewellery Consultant";

export const SITE_TAGLINE =
  "London Jewellery Consultant — Independent Jewellery Authentication";

export const SITE_DESCRIPTION =
  "An independent consultancy for branded fine jewellery — Cartier, Van Cleef & Arpels, Tiffany & Co., Bvlgari, Chopard and Chanel. Independent written assessments for buyers, sellers, insurers and private clients, returned by email within 48 hours.";

export const SITE_LOCALE = "en_GB";

export const CONTACT_EMAIL = "contact@londonjewelleryconsult.com";

/* public, indexable routes — keep in sync with the sitemap */
export const PUBLIC_ROUTES = [
  "",
  "/services",
  "/how-it-works",
  "/about",
  "/contact",
  "/begin",
  "/privacy",
  "/terms",
];
