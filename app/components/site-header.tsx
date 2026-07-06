"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark/60 bg-ink/95 text-cream backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
        <Link
          href="/"
          className="eyebrow text-cream"
          style={{ letterSpacing: "0.22em" }}
          onClick={() => setOpen(false)}
        >
          London Jewellery Consultant
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`eyebrow transition-colors hover:text-gold ${
                isActive(l.href) ? "text-gold" : "text-cream/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/begin"
            className="eyebrow bg-gold px-5 py-3 text-cream transition-colors hover:bg-gold-soft"
          >
            Begin
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-cream transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* mobile menu */}
      <nav
        className={`overflow-hidden border-t border-line-dark/60 transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`eyebrow py-3 transition-colors hover:text-gold ${
                isActive(l.href) ? "text-gold" : "text-cream/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/begin"
            onClick={() => setOpen(false)}
            className="eyebrow mt-2 bg-gold px-5 py-3 text-center text-cream transition-colors hover:bg-gold-soft"
          >
            Begin an Assessment
          </Link>
        </div>
      </nav>
    </header>
  );
}
