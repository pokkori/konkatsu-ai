import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { replyText, context } = await req.json()

    if (!replyText) {
      return NextResponse.json({ error: '相手の返信内容を入力してください。' }, { status: 400 })
    }

    const prompt = `マッチングアプリでの相手の返信を分析してください。

相手からの返信:
${replyText}
${context ? `\n会話の流れ:\n${context}` : ''}

以下の観点で分析・診断してください：
1. 脈あり度（0〜100%で評価）
2. 返信から読み取れる相手の気持ち・状況
3. 次に送るべきベストメッセージ（具体的な文例）
4. 注意すべき点・やってはいけないこと`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: 'あなたは恋愛心理学の専門家です。マッチングアプリのメッセージから相手の心理を読み取り、次の最適なアクションを具体的に提案します。',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({
      result: message.content[0].type === 'text' ? message.content[0].text : ''
    })
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
