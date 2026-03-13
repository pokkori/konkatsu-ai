import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FREE_LIMIT = 1
const COOKIE_KEY = 'konkatsu_analyze_count'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' }, { status: 429 })
  }

  const isPremium = req.cookies.get('stripe_premium')?.value === '1' || req.cookies.get('premium')?.value === '1'
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || '0')
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 429 })
  }

  try {
    const { replyText, context } = await req.json()

    if (!replyText) {
      return NextResponse.json({ error: '相手の返信内容を入力してください。' }, { status: 400 })
    }

    const prompt = `マッチングアプリでの相手の返信を分析してください。

相手からの返信:
${replyText}
${context ? `\n会話の流れ:\n${context}` : ''}

必ず以下の形式通りに出力してください（区切り文字を変更しないこと）：

SCORE:XX
===FEELINGS===
（相手の気持ち・状況を具体的に分析。感情・行動パターン・現在の関心度を3〜5文で）
===MESSAGE===
（次に送るべき返信メッセージの具体例を1〜2個。改行で区切る。そのままコピーして送れるレベルで）
===CAUTION===
（やってはいけないこと・注意点を箇条書き2〜3点。「・」で始める）`

    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: 'あなたは恋愛心理学の専門家です。マッチングアプリのメッセージから相手の心理を読み取り、次の最適なアクションを具体的に提案します。指定された出力フォーマットを必ず守ってください。',
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const scoreMatch = rawText.match(/SCORE:(\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null
    const feelings = rawText.split('===FEELINGS===')[1]?.split('===MESSAGE===')[0]?.trim() ?? ''
    const messageText = rawText.split('===MESSAGE===')[1]?.split('===CAUTION===')[0]?.trim() ?? ''
    const caution = rawText.split('===CAUTION===')[1]?.trim() ?? ''

    const newCount = cookieCount + 1
    const response = NextResponse.json({
      score,
      feelings,
      message: messageText,
      caution,
      raw: rawText,
      count: newCount,
    })
    if (!isPremium) {
      response.cookies.set(COOKIE_KEY, String(newCount), {
        maxAge: 60 * 60 * 24 * 30, sameSite: 'lax', httpOnly: true, secure: true,
      })
    }
    return response
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
