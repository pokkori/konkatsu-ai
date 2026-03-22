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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "婚活AI - AIがあなたの恋愛を全力サポート" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
