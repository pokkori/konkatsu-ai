"use client";

import Link from "next/link";

async function startCheckout(plan: string) {
  const res = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

const features = [
  {
    icon: "✏️",
    title: "プロフィール添削",
    description: "マッチング率が上がるプロフィールをAIが提案。Pairs・Tinder・withなど全アプリ対応。",
  },
  {
    icon: "💬",
    title: "メッセージ文案生成",
    description: "相手のプロフィールに合わせた自然なメッセージを3パターン即座に生成。",
  },
  {
    icon: "🔍",
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
    stripeKey: null,
    href: "/profile",
    highlight: false,
  },
  {
    name: "スタンダード",
    price: "1,980",
    features: ["プロフィール添削 無制限", "メッセージ生成 無制限", "返信分析 無制限"],
    cta: "始める",
    stripeKey: "standard",
    href: null,
    highlight: false,
  },
  {
    name: "モテるプラン",
    price: "3,980",
    features: ["スタンダード全機能", "デート会話ネタ生成", "告白文作成", "優先サポート"],
    cta: "おすすめ",
    stripeKey: "popular",
    href: null,
    highlight: true,
  },
  {
    name: "完全サポート",
    price: "9,800",
    features: ["モテるプラン全機能", "週1回AIロールプレイ練習", "専任コーチによるレビュー"],
    cta: "始める",
    stripeKey: "full",
    href: null,
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
        <span className="text-xl font-bold text-pink-600">婚活AI</span>
        <div className="flex gap-4">
          <Link href="/profile" className="text-sm text-gray-600 hover:text-pink-600">プロフィール添削</Link>
          <Link href="/message" className="text-sm text-gray-600 hover:text-pink-600">メッセージ生成</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-pink-600">料金</Link>
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
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 料金セクション */}
      <section className="py-16 px-6 bg-pink-50">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">料金プラン</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border-2 ${
                plan.highlight
                  ? "border-pink-500 bg-white shadow-lg scale-105"
                  : "border-pink-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="block text-center text-xs font-bold text-white bg-pink-500 rounded-full px-3 py-1 mb-3">
                  人気No.1
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
              {plan.stripeKey ? (
                <button
                  onClick={() => startCheckout(plan.stripeKey!)}
                  className={`w-full py-2 rounded-full text-sm font-bold transition-colors ${
                    plan.highlight
                      ? "bg-pink-600 hover:bg-pink-700 text-white"
                      : "border border-pink-300 text-pink-600 hover:bg-pink-50"
                  }`}
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
    </div>
  );
}
