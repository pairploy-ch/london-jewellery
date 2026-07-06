import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "../../lib/stripe";

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ paid: false }, { status: 503 });
  }
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? "");

    return NextResponse.json({
      paid: session.payment_status === "paid",
      paymentIntentId,
      details: session.metadata ?? {},
    });
  } catch (err) {
    console.error("checkout-status failed", err);
    return NextResponse.json({ paid: false, error: "lookup_failed" }, {
      status: 500,
    });
  }
}
