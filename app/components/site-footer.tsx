import Link from "next/link";
import { Eyebrow } from "./ui";
import { NAV_LINKS, FOOTER_LEGAL } from "./nav";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Eyebrow tone="muted">Navigate</Eyebrow>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-serif text-lg text-cream/80 transition-colors hover:text-gold-soft"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/begin"
                  className="font-serif text-lg text-cream/80 transition-colors hover:text-gold-soft"
                >
                  Begin Assessment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Eyebrow tone="muted">Legal</Eyebrow>
            <ul className="mt-5 space-y-3">
              {FOOTER_LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-serif text-lg text-cream/80 transition-colors hover:text-gold-soft"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow tone="muted">Contact</Eyebrow>
            <ul className="mt-5 space-y-3 font-serif text-lg text-cream/80">
              <li>
                <a
                  href="mailto:contact@londonjewelleryconsult.com"
                  className="break-all transition-colors hover:text-gold-soft"
                >
                  contact@londonjewelleryconsult.com
                </a>
              </li>
              <li>London, UK</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line-dark pt-6">
          <p className="eyebrow text-cream/40">
            © 2026 London Jewellery Consult. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
