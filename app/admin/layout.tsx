import Link from "next/link";

// Admin back-office chrome — deliberately separate from the marketing site.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line-dark bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/admin"
            className="eyebrow text-cream"
            style={{ letterSpacing: "0.22em" }}
          >
            London Jewellery Consult · Admin
          </Link>
          <Link
            href="/"
            className="eyebrow text-cream/60 transition-colors hover:text-gold"
          >
            View site →
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
