import Link from "next/link";
import type { ReactNode } from "react";

/* small wide-tracked uppercase label used throughout the design */
export function Eyebrow({
  children,
  tone = "gold",
  className = "",
}: {
  children: ReactNode;
  tone?: "gold" | "muted";
  className?: string;
}) {
  return (
    <span
      className={`eyebrow block ${
        tone === "gold" ? "text-gold" : "text-muted"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "solid",
  href = "/begin",
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
  href?: string;
}) {
  const base =
    "eyebrow inline-flex items-center justify-center px-8 py-4 transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-gold text-cream hover:bg-gold-soft"
      : "border border-line-dark text-cream hover:bg-cream hover:text-ink";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

/* editorial photography plate — falls back to a tasteful gradient when no src is given */
export function ImagePlate({
  caption,
  src,
  className = "",
}: {
  caption?: string;
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${
        src ? "bg-cover bg-center bg-no-repeat md:bg-contain" : ""
      } ${className}`}
      style={{
        backgroundImage: src
          ? `url(${src})`
          : "radial-gradient(120% 90% at 25% 15%, #4a3f33 0%, #2b2218 45%, #15100b 100%)",
      }}
    >
      {!src ? (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(40% 35% at 70% 75%, rgba(196,168,119,0.55) 0%, rgba(196,168,119,0) 70%)",
            }}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </>
      ) : null}
      {caption ? (
        <span
          className={`eyebrow absolute bottom-4 left-4 ${
            src ? "text-ink/60" : "text-cream/60"
          }`}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-gold/60" />
      <Eyebrow>{children}</Eyebrow>
    </div>
  );
}

/* closing call-to-action reused across pages */
export function CtaSection() {
  return (
    <section id="assessment" className="bg-ink-soft text-cream">
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
  );
}

/* dark intro banner reused by the inner pages */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-8 max-w-xl font-serif text-xl font-light text-cream/70 md:text-2xl">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
