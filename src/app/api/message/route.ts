import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

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
    return new Response(JSON.stringify({ error: 'リクエストが多すぎます。しばらく待ってから再試行してください。' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  const isPremium = req.cookies.get('stripe_premium')?.value === '1' || req.cookies.get('premium')?.value === '1'
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || '0')
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return new Response(JSON.stringify({ error: 'LIMIT_REACHED' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }

  let body: { targetProfile?: string; purpose?: string; character?: string }
  try { body = await req.json() }
  catch { return new Response(JSON.stringify({ error: 'リクエストの形式が正しくありません' }), { status: 400, headers: { 'Content-Type': 'application/json' } }) }

  const { targetProfile, purpose, character } = body

  if (!targetProfile) {
    return new Response(JSON.stringify({ error: '相手のプロフィール情報を入力してください。' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

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

  const newCount = cookieCount + 1

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = ''
        const anthropicStream = await getClient().messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          system: 'あなたはマッチングアプリのメッセージ戦略を専門とする恋愛コーチです。10年以上の婚活支援実績を持ち、返信率80%超のメッセージを生成してきた実績があります。相手のプロフィールから趣味・価値観・ライフスタイルを読み取り、共通点アプローチ・質問型アプローチ・褒め+質問のコンボなど状況に応じたパターンで、自然かつ個性的なメッセージを作成します。メッセージはそのままコピーして送れるレベルの完成品を提供し、必ず指定された出力フォーマットを守ってください。',
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
            const data = JSON.stringify({ type: 'delta', text: chunk.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        // テキスト全体をパースしてパターンを返す
        const patterns = fullText.split('===').map((block: string) => {
          const nameMatch = block.match(/NAME[：:](.+)/)
          const textMatch = block.match(/TEXT[：:]([\s\S]*?)WHY[：:]/)
          const whyMatch = block.match(/WHY[：:]([\s\S]*)$/)
          return {
            name: nameMatch?.[1]?.trim() ?? '',
            text: textMatch?.[1]?.trim() ?? '',
            why: whyMatch?.[1]?.trim() ?? '',
          }
        }).filter((p: { name: string; text: string; why: string }) => p.name && p.text)

        const doneData = JSON.stringify({ type: 'done', patterns, count: newCount })
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
        controller.close()
      } catch (error) {
        console.error('Message API stream error:', error)
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
