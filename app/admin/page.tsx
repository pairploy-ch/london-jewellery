import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import {
  isSupabaseConfigured,
  type Submission,
} from "../lib/supabase/config";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Submissions — Admin",
  robots: { index: false, follow: false },
};

function formatDate(iso: string) {
  // deterministic, locale-independent (avoids hydration mismatch)
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const submissions = (data ?? []) as Submission[];

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="eyebrow text-gold">Back Office</span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Submissions
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="eyebrow border border-line px-5 py-3 text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Sign out
            </button>
          </form>
        </div>

        <p className="mt-4 font-serif text-lg text-ink-soft">
          {submissions.length} submission{submissions.length === 1 ? "" : "s"}
        </p>

        {submissions.length === 0 ? (
          <p className="mt-12 border border-line bg-cream p-10 text-center font-serif text-lg text-muted">
            No submissions yet.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto border border-line">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream-deep/40">
                  {["Reference", "Date", "Name", "Brand", "Item", "Gemstone", "Payment", "Photos", "Status"].map(
                    (h) => (
                      <th key={h} className="eyebrow px-4 py-4 text-muted">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-line/70 transition-colors hover:bg-cream-deep/30"
                  >
                    <td className="px-4 py-4 font-serif text-sm text-ink">
                      {s.reference_number ?? "—"}
                    </td>
                    <td className="px-4 py-4 font-serif text-sm text-ink-soft">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/${s.id}`}
                        className="font-display text-base text-ink underline-offset-2 hover:text-gold hover:underline"
                      >
                        {s.name}
                      </Link>
                      <div className="font-serif text-xs text-muted">
                        {s.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-serif text-base text-ink">
                      {s.brand ?? "—"}
                    </td>
                    <td className="px-4 py-4 font-serif text-base text-ink">
                      {s.item_type ?? "—"}
                    </td>
                    <td className="px-4 py-4 font-serif text-base text-ink">
                      {s.has_gemstones === null
                        ? "—"
                        : s.has_gemstones
                          ? "Yes"
                          : "No"}
                    </td>
                    <td className="px-4 py-4 font-serif text-sm text-ink-soft">
                      {s.payment_status ?? "—"}
                    </td>
                    <td className="px-4 py-4 font-serif text-base text-ink">
                      {s.photo_paths?.length ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <span className="eyebrow text-gold">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
