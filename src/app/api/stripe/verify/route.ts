import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// This route is deprecated. Use /api/payjp/verify instead.
export async function GET() {
  return NextResponse.redirect("/api/payjp/verify", { status: 302 });
}
