import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { app, age, job, hobbies, profile, goals } = await req.json()

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

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: 'あなたはマッチングアプリの恋愛コーチングの専門家です。心理学とコピーライティングの知識を活かして、相手に好印象を与えるプロフィールを作成します。特に男性ユーザーのマッチ数向上を得意としています。',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({
      result: message.content[0].type === 'text' ? message.content[0].text : ''
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'AIの処理中にエラーが発生しました。' }, { status: 500 })
  }
}
