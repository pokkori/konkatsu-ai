import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import OrbBackground from "@/components/OrbBackground";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PHProvider } from "./providers";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

const SITE_URL = "https://konkatsu-ai.vercel.app";
const TITLE = "婚活AI｜マッチングアプリのプロフィール添削・メッセージ生成・返信分析をAIが無料サポート";
const DESC = "マッチングアプリの返信率がAIで改善。プロフ文・最初のメッセージ・デートの誘い方まで。";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "婚活AIツール", "item": `${SITE_URL}/profile` },
  ],
};

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
            "text": "登録不要・無料で利用できます（プロフィール添削3回・メッセージ生成3回・返信分析3回）。プレミアムプラン（¥1,980/月）で全機能無制限になります。Pairs（¥3,590/月〜）と比較して大幅に低価格です。"
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
        {
          "@type": "Question",
          "name": "マッチングアプリのどのメッセージに使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "最初のいいね後のファーストメッセージ・相手からの返信への返答・デート誘いのメッセージ・LINEへの誘導メッセージなど、会話のあらゆる場面で活用できます。場面を選択して入力するだけで、状況に合った文章を生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "プロフィール添削とメッセージ生成の違いは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "プロフィール添削は、自己紹介文・趣味・写真のキャプションなどのプロフィールページを最適化してマッチ数を増やすための機能です。メッセージ生成は、マッチした相手に送る個別のメッセージ文案をAIが作成する機能です。どちらも無料枠内でお試しいただけます。"
          }
        },
        {
          "@type": "Question",
          "name": "相手からAIを使っていることがバレますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AIが生成した文章をそのまま使う場合でも、相手からは自然な文章として受け取られます。生成された文章はあくまで「たたき台」として提供されるため、ご自身の言葉を少し加えるとより自然になります。当サービスが生成した事実は相手には一切通知されません。"
          }
        },
        {
          "@type": "Question",
          "name": "複数の会話を同時に管理できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、何人分の会話でも個別に入力してメッセージを生成できます。相手ごとにプロフィール情報や会話履歴を入力することで、それぞれに最適化されたメッセージを生成します。会話ごとのトーン・文体も自動で調整されます。"
          }
        },
        {
          "@type": "Question",
          "name": "入力したメッセージ内容はサーバーに保存されますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "入力された相手のプロフィールや会話内容はAI処理のためにのみ使用し、個人を特定できる形でサーバーに永続保存することはありません。プライバシーポリシーに基づき、第三者への提供も行いません。"
          }
        },
        {
          "@type": "Question",
          "name": "解約後にデータは削除されますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "プレミアムプランを解約した後も、ご利用中に入力されたデータは当社のプライバシーポリシーに従って管理されます。データ削除をご希望の場合は、サポートへお問い合わせいただければ対応いたします。"
          }
        },
        {
          "@type": "Question",
          "name": "写真の選び方や撮り方のアドバイスはしてもらえますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、プロフィール添削機能ではテキストに加えて、どのような写真が効果的かのアドバイスも提供しています。メイン写真・サブ写真の構成、表情・服装・背景のポイントなど、マッチ数向上に繋がる写真選びをAIがサポートします。"
          }
        },
        {
          "@type": "Question",
          "name": "男性・女性どちらでも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "男性・女性・同性婚を目指している方など、性別に関わらずご利用いただけます。性別を選択することでそれぞれの視点に最適化されたプロフィール添削・メッセージ生成が行われます。"
          }
        },
        {
          "@type": "Question",
          "name": "年齢制限はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "18歳以上の方を対象としたサービスです。マッチングアプリ自体の利用規約（多くは18歳以上）に合わせてご利用ください。"
          }
        },
        {
          "@type": "Question",
          "name": "初めてマッチングアプリを使う人でも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、マッチングアプリ初心者の方にこそ特におすすめです。プロフィールの書き方から最初のメッセージの送り方まで、AIが基礎から丁寧にサポートします。アプリ選びのアドバイスも含めて提供しています。"
          }
        },
        {
          "@type": "Question",
          "name": "再婚・バツイチでも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、再婚・バツイチの方も多くご利用いただいています。離婚歴の書き方・子どもの有無の伝え方など、再婚活特有の悩みにも対応したプロフィール添削とメッセージ生成を提供します。"
          }
        },
        {
          "@type": "Question",
          "name": "スマートフォンからでも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、iPhone・Androidのスマートフォンから快適にご利用いただけます。マッチングアプリを使いながら別タブで婚活AIを開き、コピー＆ペーストで簡単に活用できます。アプリのインストールは不要です。"
          }
        },
        {
          "@type": "Question",
          "name": "AIのアドバイスは恋愛心理学に基づいていますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、愛着スタイル理論・返報性の原理・類似性の法則など、恋愛・行動心理学の知見を組み込んでいます。科学的根拠に基づいたアドバイスで、感覚的なアドバイスよりも再現性の高い結果が期待できます。"
          }
        },
        {
          "@type": "Question",
          "name": "プレミアムプランの支払い方法は何がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "クレジットカード（VISA・MasterCard・JCB・American Express）でのお支払いに対応しています。月払いのみで、いつでも解約できます。解約後は次の更新日から課金が停止し、それ以降は無料枠内でのご利用となります。"
          }
        },
        {
          "@type": "Question",
          "name": "婚活AIを使ってマッチ数は本当に増えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "プロフィール添削により、キーワードの最適化・自己開示バランスの改善・アピールポイントの整理が行われます。利用者からはマッチ数が増えた・返信率が上がったという声を多数いただいています。ただし、結果には個人差があります。"
          }
        },
        {
          "@type": "Question",
          "name": "デート誘いのメッセージもAIに作ってもらえますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、メッセージ生成機能ではデート誘いのメッセージにも対応しています。タイミングの見極め方・誘い方の3パターン・断られた場合のフォローメッセージまでAIがサポートします。"
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
      { url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "婚活AI - AIがあなたの恋愛を全力サポート" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <PHProvider>
        <OrbBackground theme="life" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
        <InstallPrompt />
        <Analytics />
        <SpeedInsights />
        <GoogleAdScript />
        {process.env.NEXT_PUBLIC_CLARITY_ID && process.env.NODE_ENV === 'production' && (
          <Script
            id="clarity-init"
            strategy="afterInteractive"
          >
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
        )}
        </PHProvider>
      </body>
    </html>
  );
}
