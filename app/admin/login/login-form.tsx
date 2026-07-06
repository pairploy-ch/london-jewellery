"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  const field =
    "mt-2 w-full border-b border-line bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors focus:border-gold";

  return (
    <form action={action} className="mt-10 space-y-6">
      <label className="block">
        <span className="eyebrow text-ink/70">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
        />
      </label>
      <label className="block">
        <span className="eyebrow text-ink/70">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </label>

      {state?.error ? (
        <p className="font-serif text-base text-[#b3261e]">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="eyebrow inline-flex w-full items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
