/**
 * og.png 生成スクリプト
 * SVGをData URLで書き出し、Vercel/Next.js の opengraph-image.tsx ルートが
 * 存在するため、ここでは静的フォールバック用 og.png を public/ に配置する。
 * Node.js 標準モジュールのみ使用（canvas 不要）。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

// 1200x630 SVG を生成
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fdf2f8"/>
      <stop offset="50%" style="stop-color:#fce7f3"/>
      <stop offset="100%" style="stop-color:#fecdd3"/>
    </linearGradient>
    <linearGradient id="circle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899"/>
      <stop offset="100%" style="stop-color:#f43f5e"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="rgba(236,72,153,0.35)"/>
    </filter>
    <filter id="cardshadow">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- デコレーション円（右上） -->
  <circle cx="1120" cy="80" r="160" fill="rgba(236,72,153,0.07)"/>
  <!-- デコレーション円（左下） -->
  <circle cx="80" cy="560" r="120" fill="rgba(244,63,94,0.06)"/>

  <!-- ロゴ円 -->
  <circle cx="600" cy="155" r="70" fill="url(#circle)" filter="url(#shadow)"/>
  <text x="600" y="175" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="42" fill="white">AI</text>

  <!-- ハートアイコン（ロゴ内） -->
  <!-- 既にAIテキストで代替 -->

  <!-- タイトル -->
  <text x="600" y="295" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="80" fill="#be185d" letter-spacing="-2">婚活AI</text>

  <!-- サブタイトル -->
  <text x="600" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-weight="600" font-size="32" fill="#6b7280">AIがあなたの恋愛を全力サポート</text>

  <!-- 3機能タグ -->
  <!-- タグ1: プロフィール添削 -->
  <rect x="168" y="400" width="248" height="60" rx="30" fill="white" filter="url(#cardshadow)" stroke="#fbcfe8" stroke-width="2"/>
  <text x="292" y="437" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#db2777">プロフィール添削</text>

  <!-- タグ2: メッセージ生成 -->
  <rect x="476" y="400" width="248" height="60" rx="30" fill="white" filter="url(#cardshadow)" stroke="#fbcfe8" stroke-width="2"/>
  <text x="600" y="437" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#db2777">メッセージ生成</text>

  <!-- タグ3: 返信分析 -->
  <rect x="784" y="400" width="248" height="60" rx="30" fill="white" filter="url(#cardshadow)" stroke="#fbcfe8" stroke-width="2"/>
  <text x="908" y="437" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#db2777">返信分析</text>

  <!-- フッターテキスト -->
  <text x="600" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#9ca3af">登録不要・無料で今すぐ試せる</text>

  <!-- URL -->
  <text x="600" y="600" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#d1d5db">konkatsu-ai.vercel.app</text>
</svg>`

const outputPath = path.join(publicDir, 'og.svg')
fs.writeFileSync(outputPath, svg, 'utf-8')
console.log(`og.svg generated: ${outputPath}`)

// SVG を Data URL として og-image.txt に保存（デバッグ用）
const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
console.log('SVG size:', svg.length, 'bytes')
console.log('Done. Place og.svg in public/ and reference it as /og.svg in OGP metadata if needed.')
