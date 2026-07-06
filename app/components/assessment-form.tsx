"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { MAISONS, ITEM_TYPES, ASSESSMENT_STEPS } from "./content";
import { PaymentStep } from "./payment-step";
import { PhotosStep, type SubmissionDetails } from "./photos-step";

type Fields = {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  brand: string;
  itemType: string;
  hasGemstones: "" | "yes" | "no";
};

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "France",
  "Italy",
  "Switzerland",
  "Germany",
  "Spain",
  "United Arab Emirates",
  "Hong Kong",
  "Singapore",
  "Other",
];

/* underlined label used above every field */
function Label({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="eyebrow flex items-baseline gap-2 text-ink/70">
      {children}
      {optional ? (
        <span className="text-[0.5625rem] normal-case tracking-normal text-muted">
          Optional
        </span>
      ) : null}
    </span>
  );
}

const fieldClass =
  "mt-3 w-full border-b border-line bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold";

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  optional,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <Label optional={optional}>
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </Label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  optional,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <Label optional={optional}>
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </Label>
      <div className="relative">
        <select
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} appearance-none pr-8 ${
            value ? "text-ink" : "text-muted/70"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute bottom-3 right-1 text-gold">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </label>
  );
}

/* 01 — 02 — 03 — 04 progress indicator */
function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 md:gap-4">
      {ASSESSMENT_STEPS.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={s.no} className="flex items-center gap-2 md:gap-4">
            <span
              aria-current={active ? "step" : undefined}
              title={s.title}
              className={`flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm transition-colors md:h-12 md:w-12 md:text-base ${
                active
                  ? "border-ink bg-ink text-cream"
                  : done
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-line text-muted"
              }`}
            >
              {s.no}
            </span>
            {n < ASSESSMENT_STEPS.length ? (
              <span
                className={`h-px w-6 md:w-10 ${done ? "bg-gold" : "bg-line"}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* Step 1 — customer & piece details */
function StepDetails({
  fields,
  set,
}: {
  fields: Fields;
  set: (key: keyof Fields) => (v: string) => void;
}) {
  return (
    <>
      <h2 className="font-display text-3xl md:text-4xl">Your details</h2>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        Tell us about you and the piece. We specialise in six Maisons — items
        outside our scope are flagged before payment.
      </p>

      <div className="mt-8 space-y-7">
        <TextField label="Name" required value={fields.name} onChange={set("name")} />
        <TextField
          label="Email"
          type="email"
          required
          value={fields.email}
          onChange={set("email")}
        />
        <TextField
          label="Phone"
          type="tel"
          optional
          placeholder="Optional"
          value={fields.phone}
          onChange={set("phone")}
        />
        <SelectField
          label="Country"
          optional
          placeholder="Optional"
          options={COUNTRIES}
          value={fields.country}
          onChange={set("country")}
        />
        <TextField
          label="Address"
          optional
          placeholder="Optional"
          value={fields.address}
          onChange={set("address")}
        />
        <SelectField
          label="Brand"
          required
          placeholder="Select a brand"
          options={MAISONS}
          value={fields.brand}
          onChange={set("brand")}
        />
        <SelectField
          label="Item Type"
          required
          placeholder="Select an item type"
          options={ITEM_TYPES}
          value={fields.itemType}
          onChange={set("itemType")}
        />
      </div>
    </>
  );
}

/* large yes / no choice card used by the eligibility step */
function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex-1 border p-6 text-left transition-colors ${
        selected
          ? "border-gold bg-gold/10"
          : "border-line bg-cream hover:border-gold/50"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            selected ? "border-gold" : "border-muted"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              selected ? "bg-gold" : "bg-transparent"
            }`}
          />
        </span>
        <span className="font-display text-xl">{label}</span>
      </span>
      <span className="mt-2 block font-serif text-base leading-relaxed text-ink-soft">
        {description}
      </span>
    </button>
  );
}

/* Step 2 — diamond / coloured gemstone screening (out-of-scope filter) */
function StepEligibility({
  fields,
  set,
}: {
  fields: Fields;
  set: (key: keyof Fields) => (v: string) => void;
}) {
  const blocked = fields.hasGemstones === "yes";
  return (
    <>
      <h2 className="font-display text-3xl md:text-4xl">The piece</h2>
      <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
        Does this piece contain diamonds or coloured gemstones? High-value stones
        cannot be assessed reliably from photographs alone.
      </p>

      <div className="mt-8">
        <span className="eyebrow text-ink/70">
          Diamonds or coloured gemstones<span className="text-gold"> *</span>
        </span>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <ChoiceCard
            label="No"
            description="No diamonds or coloured gemstones — eligible for online assessment."
            selected={fields.hasGemstones === "no"}
            onSelect={() => set("hasGemstones")("no")}
          />
          <ChoiceCard
            label="Yes"
            description="Contains diamonds or coloured gemstones."
            selected={fields.hasGemstones === "yes"}
            onSelect={() => set("hasGemstones")("yes")}
          />
        </div>
      </div>

      {blocked ? (
        <div
          role="alert"
          className="mt-8 border-l-2 border-gold bg-gold/5 p-6"
        >
          <p className="eyebrow text-gold">In-person inspection required</p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-ink">
            Online assessment is not available for pieces with diamonds or
            coloured gemstones. To ensure a precise and accurate evaluation,
            high-value stones require an in-person inspection. Please contact us
            directly to arrange a physical assessment with our specialist.
          </p>
          <a
            href="mailto:contact@londonjewelleryconsult.com?subject=Private%20Consultation%20Enquiry"
            className="eyebrow mt-5 inline-flex items-center justify-center border border-gold px-7 py-3 text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            Contact Us
          </a>
        </div>
      ) : null}
    </>
  );
}

export function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    brand: "",
    itemType: "",
    hasGemstones: "",
  });

  const [restoredDetails, setRestoredDetails] =
    useState<SubmissionDetails | null>(null);
  const [resuming, setResuming] = useState(false);

  const set = (key: keyof Fields) => (v: string) =>
    setFields((f) => ({ ...f, [key]: v }));

  const currentDetails: SubmissionDetails = {
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    country: fields.country,
    address: fields.address,
    brand: fields.brand,
    itemType: fields.itemType,
    hasGemstones: fields.hasGemstones,
  };

  // On returning from Stripe Checkout, confirm payment and resume at Step 4.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      if (params.get("canceled")) {
        window.history.replaceState({}, "", "/begin");
      }
      return;
    }
    setResuming(true);
    fetch(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.paid) {
          const d = (data.details ?? {}) as Partial<SubmissionDetails>;
          setRestoredDetails({
            name: d.name ?? "",
            email: d.email ?? "",
            phone: d.phone ?? "",
            country: d.country ?? "",
            address: d.address ?? "",
            brand: d.brand ?? "",
            itemType: d.itemType ?? "",
            hasGemstones: d.hasGemstones ?? "",
          });
          setPaymentIntentId(data.paymentIntentId ?? "");
          setStep(4);
        }
      })
      .catch(() => {})
      .finally(() => {
        window.history.replaceState({}, "", "/begin");
        setResuming(false);
      });
  }, []);

  const blocked = step === 2 && fields.hasGemstones === "yes";

  const canContinue = (() => {
    if (step === 1) {
      return (
        fields.name.trim() !== "" &&
        fields.email.trim() !== "" &&
        fields.brand !== "" &&
        fields.itemType !== ""
      );
    }
    if (step === 2) return fields.hasGemstones === "no";
    return true;
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Steps 3 & 4 advance via their own actions (payment / photo submit),
    // not via a generic form submit.
    if (step === 3 || step === 4 || !canContinue) return;
    setStep((s) => Math.min(s + 1, ASSESSMENT_STEPS.length));
  }

  // returning from Stripe Checkout — confirming payment
  if (resuming) {
    return (
      <div className="mx-auto max-w-xl">
        <StepIndicator current={3} />
        <div className="mt-10 border border-line bg-cream p-7 text-center md:mt-12 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl">
            Confirming your payment…
          </h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
            One moment while we confirm your payment and prepare the next step.
          </p>
        </div>
      </div>
    );
  }

  // success screen shown after photos are submitted (the "Step 5" confirmation)
  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <StepIndicator current={ASSESSMENT_STEPS.length + 1} />
        <div className="mt-10 border border-line bg-cream p-7 text-center md:mt-12 md:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl">
            Submission received
          </h2>
          <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink-soft">
            Thank you. We have received your piece and photographs. A confirmation
            has been sent to{" "}
            <span className="text-ink">{fields.email || "your email"}</span>, and
            your written assessment will follow by email within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <StepIndicator current={step} />

      <form
        onSubmit={handleSubmit}
        className="mt-10 border border-line bg-cream p-7 md:mt-12 md:p-10"
      >
        {step === 1 ? <StepDetails fields={fields} set={set} /> : null}
        {step === 2 ? <StepEligibility fields={fields} set={set} /> : null}
        {step === 3 ? (
          <PaymentStep
            details={currentDetails}
            onSkipPreview={() => setStep(4)}
          />
        ) : null}
        {step === 4 ? (
          <PhotosStep
            details={restoredDetails ?? currentDetails}
            paymentIntentId={paymentIntentId}
            onSubmitted={() => setSubmitted(true)}
          />
        ) : null}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          {/* Back — hidden on the paid photos step so payment can't be re-entered */}
          {step > 1 && step !== 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 1))}
              className="eyebrow text-muted transition-colors hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <span className="eyebrow text-muted">
              Step {step} of {ASSESSMENT_STEPS.length}
            </span>
          )}

          {/* Steps 3 & 4 own their action buttons; blocked eligibility hides Continue */}
          {step !== 3 && step !== 4 && !blocked ? (
            <button
              type="submit"
              disabled={!canContinue}
              className="eyebrow inline-flex items-center justify-center bg-gold px-8 py-4 text-cream transition-colors duration-300 hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
              Continue
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
