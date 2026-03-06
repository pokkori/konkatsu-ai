import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { targetProfile, purpose, character } = await req.json()

    if (!targetProfile) {
      return NextResponse.json({ error: '相手のプロフィール情報を入力してください。' }, { status: 400 })
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

メッセージの目的: ${purposeLabel[purpose] || purpose}
自分のキャラクター: ${characterLabel[character] || character}

3パターンの文案を作成してください。それぞれ:
- パターン名（例：共通点アプローチ）
- メッセージ本文
- このメッセージが効果的な理由`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: 'あなたはマッチングアプリのメッセージ術の専門家です。返信率が高く、自然で魅力的なメッセージを作成します。相手のプロフィールから共通点や興味を見つけ、会話が弾むきっかけを作ります。',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({
      result: message.content[0].type === 'text' ? message.content[0].text : ''
    })
  } catch (error) {
    console.error('Message API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
