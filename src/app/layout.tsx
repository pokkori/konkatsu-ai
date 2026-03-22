import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://konkatsu-ai.vercel.app";
const TITLE = "婚活AI｜マッチングアプリのプロフィール添削・メッセージ生成・返信分析をAIが無料サポート";
const DESC = "Pairs・Tinder・withなど全アプリ対応。AIがマッチングアプリのプロフィールを添削しマッチ数平均2.8倍に。メッセージ3パターン即生成・返信の脈あり度も分析。登録不要・無料で今すぐ試せる婚活AIサービス。";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "婚活AI",
      "url": SITE_URL,
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "基本無料・プレミアムプラン ¥1,980/月" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "マッチングアプリのプロフィールをAIで添削してもらえますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pairs・Tinder・with・Bumble・タップルなど主要マッチングアプリのプロフィールに対応しています。年齢・職業・趣味・現在のプロフィール文を入力するだけで、マッチ数を最大化するためのAI添削を無料で受けられます。"
          }
        },
        {
          "@type": "Question",
          "name": "メッセージの返信率を上げる方法を教えてください",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "相手のプロフィールを貼り付けるだけで、共通点アプローチ・質問型アプローチ・褒め+質問コンボの3パターンのメッセージ文案をAIが即生成します。そのままコピーして送れる完成品を提供します。"
          }
        },
        {
          "@type": "Question",
          "name": "相手の返信から脈あり度を診断できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "相手の返信テキストを入力するだけで、AIが脈あり度スコア・相手の気持ち分析・次に送るべきメッセージ・やってはいけないことを診断します。愛着スタイル理論・非言語コミュニケーション分析を活用した科学的アプローチです。"
          }
        },
        {
          "@type": "Question",
          "name": "無料で使えますか？料金はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "登録不要・無料で利用できます（プロフィール添削1回・メッセージ生成3回・返信分析1回）。プレミアムプラン（¥1,980/月）で全機能無制限になります。Pairs（¥3,590/月〜）と比較して大幅に低価格です。"
          }
        },
        {
          "@type": "Question",
          "name": "どのマッチングアプリに対応していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pairs・Tinder・Bumble・with・タップルなど国内外の主要マッチングアプリに対応しています。アプリごとのユーザー層・トーンの違いを考慮したプロフィール文・メッセージを生成します。"
          }
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>AI</text></svg>" },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "婚活AI",
    locale: "ja_JP",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "婚活AI - AIがあなたの恋愛を全力サポート" },
      { url: "/og.svg", width: 1200, height: 630, alt: "婚活AI - AIがあなたの恋愛を全力サポート" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
