import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const FREE_LIMIT = 3
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
    return new Response(JSON.stringify({ error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  const isPremium = req.cookies.get('stripe_premium')?.value === '1' || req.cookies.get('premium')?.value === '1'
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || '0')
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return new Response(JSON.stringify({ error: 'LIMIT_REACHED' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  let body: { app?: string; age?: string; job?: string; hobbies?: string; profile?: string; goals?: string[] }
  try { body = await req.json() }
  catch { return new Response(JSON.stringify({ error: 'リクエストの形式が正しくありません' }), { status: 400, headers: { 'Content-Type': 'application/json' } }) }

  const { app, age, job, hobbies, profile, goals } = body

  if (!age || !job || !profile) {
    return new Response(JSON.stringify({ error: '年齢・職業・プロフィール文は必須です。' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
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

  const newCount = cookieCount + 1

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await getClient().messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          system: 'あなたは恋愛コーチングと婚活支援を15年以上専門とするプロフェッショナルです。Pairs・Tinder・with・Bumble・タップルなど国内外の主要マッチングアプリを熟知し、5,000件以上のプロフィール添削実績があります。ロバート・チャルディーニの影響力の原理・ミラーリング効果・自己開示の返報性といった社会心理学の知見と、セールスコピーライティングの技術を組み合わせて、マッチ率を最大化するプロフィール文を作成します。ユーザーの年齢・職業・アプリの特性に応じた最適な表現戦略を取り、具体的かつそのままコピーして使えるレベルの添削結果を提供してください。',
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const data = JSON.stringify({ type: 'delta', text: chunk.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        // 完了メッセージ（カウント情報を含む）
        const doneData = JSON.stringify({ type: 'done', count: newCount })
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
        controller.close()
      } catch (error) {
        console.error('Profile API stream error:', error)
        const errData = JSON.stringify({ type: 'error', message: 'AIの処理中にエラーが発生しました。' })
        controller.enqueue(encoder.encode(`data: ${errData}\n\n`))
        controller.close()
      }
    },
  })

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  if (!isPremium) {
    headers.append('Set-Cookie', `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure; Path=/`)
  }

  return new Response(stream, { headers })
}
