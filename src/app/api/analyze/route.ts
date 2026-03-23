import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

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
    return new Response(JSON.stringify({ error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  const isPremium = req.cookies.get('stripe_premium')?.value === '1' || req.cookies.get('premium')?.value === '1'
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || '0')
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return new Response(JSON.stringify({ error: 'LIMIT_REACHED' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  let body: { replyText?: string; context?: string }
  try { body = await req.json() }
  catch { return new Response(JSON.stringify({ error: 'リクエストの形式が正しくありません' }), { status: 400, headers: { 'Content-Type': 'application/json' } }) }

  const { replyText, context } = body

  if (!replyText) {
    return new Response(JSON.stringify({ error: '相手の返信内容を入力してください。' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
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

  const newCount = cookieCount + 1

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = ''
        const anthropicStream = await getClient().messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1200,
          system: 'あなたはマッチングアプリでの恋愛心理分析を専門とするカウンセラーです。12年以上にわたりメッセージカウンセリングを行い、3,000件超の相談実績があります。依存理論・愛着スタイル理論・非言語コミュニケーション分析の知識を駆使し、返信文の語尾・絵文字の使い方・返信速度から相手の興味度・感情状態を正確に読み取ります。分析は常に根拠を示しながら具体的・実用的に行い、次のメッセージはそのままコピーして送れるレベルで提示してください。指定された出力フォーマットを必ず守ってください。',
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
            const data = JSON.stringify({ type: 'delta', text: chunk.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        // パース処理
        const scoreMatch = fullText.match(/SCORE:(\d+)/)
        const score = scoreMatch ? parseInt(scoreMatch[1]) : null
        const feelings = fullText.split('===FEELINGS===')[1]?.split('===MESSAGE===')[0]?.trim() ?? ''
        const messageText = fullText.split('===MESSAGE===')[1]?.split('===CAUTION===')[0]?.trim() ?? ''
        const caution = fullText.split('===CAUTION===')[1]?.trim() ?? ''

        const doneData = JSON.stringify({ type: 'done', score, feelings, message: messageText, caution, count: newCount })
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
        controller.close()
      } catch (error) {
        console.error('Analyze API stream error:', error)
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
