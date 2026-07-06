import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "../../lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Sign In — London Jewellery Consultant",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-md px-5 py-20 md:px-10 md:py-28">
        <span className="eyebrow text-gold">Back Office</span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">Admin sign in</h1>

        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-8 border-l-2 border-gold bg-gold/5 p-4 font-serif text-base leading-relaxed text-ink-soft">
            Supabase is not configured yet. Add your Supabase keys to{" "}
            <code className="font-sans text-sm">.env.local</code> and run{" "}
            <code className="font-sans text-sm">supabase/schema.sql</code> to
            enable the admin area.
          </p>
        )}
      </section>
    </main>
  );
}
