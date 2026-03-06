import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FREE_LIMIT = 1
const COOKIE_KEY = 'konkatsu_profile_count'

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

  const isPremium = req.cookies.get('stripe_premium')?.value === '1'
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || '0')
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 429 })
  }

  let body: { app?: string; age?: string; job?: string; hobbies?: string; profile?: string; goals?: string[] }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'リクエストの形式が正しくありません' }, { status: 400 }) }

  const { app, age, job, hobbies, profile, goals } = body

    if (!age || !job || !profile) {
      return NextResponse.json({ error: '年齢・職業・プロフィール文は必須です。' }, { status: 400 })
    }

    const prompt = `以下のマッチングアプリのプロフィールを添削してください。

アプリ: ${app}
年齢: ${age}歳
職業: ${job}
趣味: ${hobbies || '未記入'}
現在のプロフィール文:
${profile}
改善したいポイント: ${Array.isArray(goals) && goals.length > 0 ? goals.join('、') : 'マッチ数を増やしたい'}

以下の形式で回答してください：
1. 改善版プロフィール文
2. 改善ポイントの解説（箇条書き3〜5点）
3. さらにマッチ数を増やすための追加アドバイス`

    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: 'あなたはマッチングアプリの恋愛コーチングの専門家です。心理学とコピーライティングの知識を活かして、相手に好印象を与えるプロフィールを作成します。特に男性ユーザーのマッチ数向上を得意としています。',
      messages: [{ role: 'user', content: prompt }],
    })

    const result = message.content[0].type === 'text' ? message.content[0].text : ''
    const newCount = cookieCount + 1
    const res = NextResponse.json({ result, count: newCount })

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
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
