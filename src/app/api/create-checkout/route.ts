import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const PRICES: Record<string, string> = {
  standard: process.env.STRIPE_PRICE_STD!,
  popular: process.env.STRIPE_PRICE_POPULAR!,
  full: process.env.STRIPE_PRICE_FULL!,
};

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const priceId = PRICES[plan];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const origin = req.headers.get("origin") || "https://konkatsu-ai.vercel.app";
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#pricing`,
    locale: "ja",
  });
  return NextResponse.json({ url: session.url });
}
