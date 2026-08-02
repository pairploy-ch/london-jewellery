"use client";

import { useActionState, useState } from "react";
import { login } from "../actions";

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 5.2C11.05 5.07 11.51 5 12 5c7 0 10.5 7 10.5 7-.7 1.4-1.65 2.9-2.94 4.15M6.5 6.5C3.6 8.3 1.5 12 1.5 12s3.5 7 10.5 7c1.6 0 3-.36 4.24-.96M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${field} pr-9`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute bottom-1.5 right-0 text-muted transition-colors hover:text-gold"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
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
