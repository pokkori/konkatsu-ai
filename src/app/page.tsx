"use client";

import { useState } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-pink-500 mx-auto" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h4v4H3v-4z" />
      </svg>
    ),
    title: "プロフィール添削",
    description: "マッチング率が上がるプロフィールをAIが提案。Pairs・Tinder・withなど全アプリ対応。",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-pink-500 mx-auto" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "メッセージ文案生成",
    description: "相手のプロフィールに合わせた自然なメッセージを3パターン即座に生成。",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-pink-500 mx-auto" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "返信分析",
    description: "相手の返信から脈あり度を診断。次のメッセージへのアドバイス付き。",
  },
];

const plans = [
  {
    name: "無料",
    price: "0",
    features: ["プロフィール添削 1回", "メッセージ生成 3回", "返信分析 1回"],
    cta: "無料で始める",
    isPaid: false,
    href: "/profile",
    highlight: false,
  },
  {
    name: "プレミアム",
    price: "1,980",
    features: ["プロフィール添削 無制限", "メッセージ生成 無制限", "返信分析 無制限"],
    cta: "始める",
    isPaid: true,
    href: null,
    highlight: true,
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-pink-100" aria-label="メインナビゲーション">
        <span className="text-xl font-bold text-pink-600" aria-label="婚活AI トップページ">婚活AI</span>
        <div className="flex gap-4">
          <Link href="/profile" className="text-sm text-gray-600 hover:text-pink-600" aria-label="プロフィール添削ツールへ">プロフィール添削</Link>
          <Link href="/message" className="text-sm text-gray-600 hover:text-pink-600" aria-label="メッセージ生成ツールへ">メッセージ生成</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-pink-600" aria-label="料金プラン一覧へ">料金</Link>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-pink-50 to-red-50">
        <p className="text-sm font-semibold text-pink-500 mb-3 tracking-widest uppercase">AI Powered Matching Support</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          AIがあなたの恋愛を<br />
          <span className="text-pink-600">全力サポート</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          プロフィール添削・メッセージ文案・返信分析をAIが担当。<br />
          マッチ数を増やして、理想の出会いを掴もう。
        </p>
        <Link
          href="/profile"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-colors"
          aria-label="プロフィール添削を無料で試す"
        >
          無料で試してみる
        </Link>
        <p className="text-sm text-gray-400 mt-4">クレジットカード不要・登録1分</p>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">3つの強力な機能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6 rounded-2xl bg-pink-50 border border-pink-100">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="py-16 px-6 bg-pink-50">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">料金プラン</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border-2 ${
                plan.highlight
                  ? "border-pink-500 bg-white shadow-lg"
                  : "border-pink-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="block text-center text-xs font-bold text-white bg-pink-500 rounded-full px-3 py-1 mb-3">
                  おすすめ
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-pink-600">¥{plan.price}</span>
                {plan.price !== "0" && <span className="text-gray-500 text-sm">/月</span>}
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <span className="text-pink-500 mt-0.5">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.isPaid ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-2 rounded-full text-sm font-bold transition-colors bg-pink-600 hover:bg-pink-700 text-white"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href!}
                  className="block text-center py-2 rounded-full text-sm font-bold border border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t">
        © 2025 婚活AI. All rights reserved.
      </footer>

      {showModal && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="プレミアムプラン ¥1,980/月 — プロフィール添削・メッセージ生成・返信分析 無制限"
          onSuccess={() => {
            setShowModal(false);
            window.location.href = "/success";
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
