import Stripe from "stripe";

/* Server-side Stripe client. Reads the secret key from the environment
   lazily so the app still builds/boots when the key is not yet set. */
let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripe) {
    // apiVersion is omitted to use the version pinned by the installed SDK.
    stripe = new Stripe(key);
  }
  return stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
