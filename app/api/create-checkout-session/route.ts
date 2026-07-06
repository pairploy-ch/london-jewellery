import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "../../lib/stripe";
import { ASSESSMENT_FEE } from "../../components/content";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // metadata optional
  }
  const str = (k: string) => {
    const v = body[k];
    return typeof v === "string" ? v.trim().slice(0, 200) : "";
  };

  const origin =
    request.headers.get("origin") || new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: ASSESSMENT_FEE.currency,
            unit_amount: ASSESSMENT_FEE.amount,
            product_data: { name: "Independent jewellery assessment" },
          },
        },
      ],
      customer_email: str("email") || undefined,
      // Carried across the redirect — read back on return via checkout-status.
      metadata: {
        name: str("name"),
        email: str("email"),
        phone: str("phone"),
        country: str("country"),
        address: str("address"),
        brand: str("brand"),
        itemType: str("itemType"),
        hasGemstones: str("hasGemstones"),
      },
      success_url: `${origin}/begin?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/begin?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session failed", err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
