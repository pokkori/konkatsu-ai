import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// This route is deprecated. Use /api/payjp/checkout instead.
export async function POST() {
  return NextResponse.redirect("/api/payjp/checkout", { status: 302 });
}
