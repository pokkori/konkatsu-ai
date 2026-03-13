import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FREE_LIMIT = 3
const COOKIE_KEY = 'konkatsu_message_count'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const rateLimit = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true }
  if (entry.count >= 10) return false
  entry.count++
  return true
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

  let body: { targetProfile?: string; purpose?: string; character?: string }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'リクエストの形式が正しくありません' }, { status: 400 }) }

  const { targetProfile, purpose, character } = body

  if (!targetProfile) {
    return NextResponse.json({ error: '相手のプロフィール情報を入力してください。' }, { status: 400 })
  }

  try {
    const purposeLabel: Record<string, string> = {
      first: '最初のメッセージ（マッチング直後）',
      date: 'デートに誘うメッセージ',
      reply: '返信が来た後の返し方',
    }

    const characterLabel: Record<string, string> = {
      bright: '明るく元気な',
      calm: '落ち着いて誠実な',
      funny: 'ユーモアがある面白い',
      serious: '真面目で誠実な',
    }

    const prompt = `マッチングアプリのメッセージ文案を3パターン作成してください。

相手のプロフィール:
${targetProfile}

メッセージの目的: ${purpose ? (purposeLabel[purpose] || purpose) : ''}
自分のキャラクター: ${character ? (characterLabel[character] || character) : ''}

以下の形式で3パターン出力してください（区切り文字を必ず守ること）：

NAME:（パターン名。例：共通点アプローチ）
TEXT:（メッセージ本文。そのままコピーして送れるレベルで）
WHY:（このメッセージが効果的な理由を1〜2文で）
===
NAME:（パターン名）
TEXT:（メッセージ本文）
WHY:（理由）
===
NAME:（パターン名）
TEXT:（メッセージ本文）
WHY:（理由）`

    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: 'あなたはマッチングアプリのメッセージ術の専門家です。返信率が高く、自然で魅力的なメッセージを作成します。相手のプロフィールから共通点や興味を見つけ、会話が弾むきっかけを作ります。必ず指定された出力フォーマットを守ってください。',
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the 3 patterns from the structured output
    const patterns = rawText.split('===').map((block: string) => {
      const nameMatch = block.match(/NAME[：:](.+)/)
      const textMatch = block.match(/TEXT[：:]([\s\S]*?)WHY[：:]/)
      const whyMatch = block.match(/WHY[：:]([\s\S]*)$/)
      return {
        name: nameMatch?.[1]?.trim() ?? '',
        text: textMatch?.[1]?.trim() ?? '',
        why: whyMatch?.[1]?.trim() ?? '',
      }
    }).filter((p: { name: string; text: string; why: string }) => p.name && p.text)

    const newCount = cookieCount + 1
    const res = NextResponse.json({ patterns, raw: rawText, count: newCount })

    if (!isPremium) {
      res.cookies.set(COOKIE_KEY, String(newCount), {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        httpOnly: true,
        secure: true,
      })
    }
    return res
  } catch (error) {
    console.error('Message API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
