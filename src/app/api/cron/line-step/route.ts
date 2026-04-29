/**
 * LINE ステップ配信 CRON - 婚活AI
 * GET /api/cron/line-step
 * Vercel CRON: "0 0 * * *" (毎日 09:00 JST)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SERVICE_URL = "https://konkatsu-ai.vercel.app";
const SERVICE_NAME = "婚活AI";
const MONTHLY_PRICE = "¥1,980";
const APP_ID = "konkatsu-ai";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface StepDef {
  step: number;
  nextStep: number | null;
  daysUntilNext: number;
  message: string;
}

const STEPS: StepDef[] = [
  {
    step: 1,
    nextStep: 2,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】マッチングアプリの調子はいかがですか？

プロフィール文・自己PR・メッセージ返信文をAIが生成します。何度でも無料でお試しください:
${SERVICE_URL}`,
  },
  {
    step: 2,
    nextStep: 3,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】ご利用中の方の声をご紹介します。

「AIにプロフィール添削してもらったら、いいね数が3倍になった」（30代 / 女性）

月額プランなら添削・生成・分析が無制限で${MONTHLY_PRICE}。
マッチングアプリ代より安く、成果は確実に上がります:
${SERVICE_URL}/pricing`,
  },
  {
    step: 3,
    nextStep: 4,
    daysUntilNext: 2,
    message: `【${SERVICE_NAME}】無料で3回まで生成できます。

まだお試しでない方はこちら:
${SERVICE_URL}

月額プランでは無制限生成に加えて、相手のプロフィール分析機能も使えます。`,
  },
  {
    step: 4,
    nextStep: 5,
    daysUntilNext: 3,
    message: `【${SERVICE_NAME}】期間限定のご案内です。

今週末まで、月額プランを初月20%OFFでご提供しています。

通常${MONTHLY_PRICE} → 初月 ¥1,584

この機会にぜひ:
${SERVICE_URL}/pricing?coupon=LINE20`,
  },
  {
    step: 5,
    nextStep: 6,
    daysUntilNext: 4,
    message: `【${SERVICE_NAME}】デートの誘い文・デート後のLINEもAIが生成します。

告白のタイミングが近づいてきたら、告白文の作成もお任せください:
${SERVICE_URL}`,
  },
  {
    step: 6,
    nextStep: null,
    daysUntilNext: 0,
    message: `【${SERVICE_NAME}】をご利用いただきありがとうございます。

素敵な出会いが見つかることを応援しています。

年額プランで2ヶ月分お得になります:
${SERVICE_URL}/pricing`,
  },
];

async function sendLineMessage(userId: string, text: string): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return false;
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }],
    }),
  });
  return res.ok;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();

  const { data: users, error } = await supabase
    .from("line_step_users")
    .select("id, line_user_id, step, next_send_at")
    .lte("next_send_at", now.toISOString())
    .lt("step", 6)
    .eq("app_id", APP_ID)
    .order("next_send_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { userId: string; step: number; status: string }[] = [];

  for (const user of users ?? []) {
    const stepDef = STEPS.find((s) => s.step === (user.step as number) + 1);
    if (!stepDef) continue;

    const sent = await sendLineMessage(user.line_user_id as string, stepDef.message);
    const nextSendAt =
      stepDef.nextStep !== null && stepDef.daysUntilNext > 0
        ? new Date(now.getTime() + stepDef.daysUntilNext * 86400 * 1000).toISOString()
        : null;

    await supabase
      .from("line_step_users")
      .update({ step: stepDef.step, next_send_at: nextSendAt, updated_at: now.toISOString() })
      .eq("id", user.id);

    results.push({ userId: user.line_user_id as string, step: stepDef.step, status: sent ? "sent" : "error" });
  }

  return NextResponse.json({ processed: results.length, results, executedAt: now.toISOString() });
}
