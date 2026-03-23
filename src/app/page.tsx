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
    href: "/profile",
    accent: "from-pink-500 to-rose-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-rose-500 mx-auto" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "メッセージ文案生成",
    description: "相手のプロフィールに合わせた自然なメッセージを3パターン即座に生成。",
    href: "/message",
    accent: "from-rose-500 to-red-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 text-red-500 mx-auto" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "返信分析",
    description: "相手の返信から脈あり度を診断。次のメッセージへのアドバイス付き。",
    href: "/analyze",
    accent: "from-red-500 to-orange-500",
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

const stats = [
  { label: "マッチ数平均", value: "2.8倍", sub: "添削後の実績" },
  { label: "返信率", value: "80%超", sub: "メッセージ生成" },
  { label: "利用者数", value: "10,000+", sub: "累計ユーザー" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* ナビゲーション — グラスモーフィズム */}
      <nav
        className="sticky top-0 z-40 glass-nav border-b border-pink-100/50 shadow-sm"
        aria-label="メインナビゲーション"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" aria-label="婚活AI トップページ">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">婚活AI</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              aria-label="プロフィール添削ツールへ"
              className="text-sm text-gray-600 hover:text-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-all"
            >
              プロフィール添削
            </Link>
            <Link
              href="/message"
              aria-label="メッセージ生成ツールへ"
              className="text-sm text-gray-600 hover:text-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-all"
            >
              メッセージ生成
            </Link>
            <Link
              href="/pricing"
              aria-label="料金プラン一覧へ"
              className="text-sm text-gray-600 hover:text-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-all"
            >
              料金
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden text-center py-24 px-6">
        {/* 背景デコレーション */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-red-200/30 to-pink-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-pink-500 mb-3 tracking-widest uppercase">AI Powered Matching Support</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AIがあなたの恋愛を<br />
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">全力サポート</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            プロフィール添削・メッセージ文案・返信分析をAIが担当。<br />
            マッチ数を増やして、理想の出会いを掴もう。
          </p>

          {/* CTA ボタン */}
          <Link
            href="/profile"
            aria-label="プロフィール添削を無料で試す"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-100"
          >
            無料で試してみる
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
          <p className="text-sm text-gray-400 mt-4">クレジットカード不要・登録1分</p>

          {/* 統計バッジ */}
          <div className="mt-12 flex flex-wrap justify-center gap-4" role="list" aria-label="サービス実績">
            {stats.map((s) => (
              <div
                key={s.label}
                role="listitem"
                className="glass-card border-pink-100/60 rounded-2xl px-6 py-3 shadow-sm"
              >
                <div className="text-2xl font-bold text-pink-600">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-6 max-w-5xl mx-auto" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold text-center text-gray-900 mb-12">3つの強力な機能</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              aria-label={`${f.title}ツールを使う`}
              className="group block text-center p-8 rounded-3xl glass-card border-pink-100/60 shadow-sm hover:shadow-lg hover:shadow-pink-100/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-5">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                使ってみる
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 社会的証明セクション */}
      <section className="py-12 px-6 max-w-4xl mx-auto" aria-labelledby="proof-heading">
        <h2 id="proof-heading" className="text-xl font-bold text-center text-gray-800 mb-8">使った人の声</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { text: "プロフィールを添削してもらったら、マッチ数が3倍になりました！", name: "30代・会社員" },
            { text: "メッセージ生成が秀逸。3パターン全部使えるクオリティで返信率が上がった。", name: "28歳・エンジニア" },
            { text: "返信分析で脈なしと分かって次の人に集中できた。時短すぎる。", name: "25歳・看護師" },
          ].map((v, i) => (
            <figure
              key={i}
              className="glass-card border-pink-100/60 rounded-2xl p-5 shadow-sm"
              aria-label={`${v.name}さんの口コミ`}
            >
              <div className="flex gap-0.5 mb-3" role="img" aria-label="星5つ評価">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                  </svg>
                ))}
              </div>
              <blockquote>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">&ldquo;{v.text}&rdquo;</p>
              </blockquote>
              <figcaption className="text-xs text-gray-400">{v.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="py-16 px-6" aria-labelledby="pricing-heading">
        <h2 id="pricing-heading" className="text-2xl font-bold text-center text-gray-900 mb-12">料金プラン</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 border-2 transition-all duration-300 ${
                plan.highlight
                  ? "border-pink-400 glass-card-strong shadow-xl shadow-pink-100/60 hover:shadow-pink-200/60 hover:-translate-y-0.5"
                  : "border-pink-200 glass-card hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <span className="block text-center text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full px-3 py-1 mb-4">
                  おすすめ
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
              <div className="mb-5">
                <span className="text-3xl font-bold text-pink-600">¥{plan.price}</span>
                {plan.price !== "0" && <span className="text-gray-500 text-sm">/月</span>}
              </div>
              <ul className="text-sm text-gray-600 space-y-2.5 mb-7" role="list" aria-label={`${plan.name}プランの機能`}>
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.isPaid ? (
                <button
                  onClick={() => setShowModal(true)}
                  aria-label={`${plan.name}プランに登録する — ¥${plan.price}/月`}
                  className="w-full py-3 rounded-full text-sm font-bold transition-all duration-200 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-200 hover:scale-[1.02] active:scale-100"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href!}
                  aria-label={`${plan.name}プランで始める`}
                  className="block text-center py-3 rounded-full text-sm font-bold border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 transition-all duration-200"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center py-10 text-sm text-gray-400 border-t border-pink-100/60">
        <nav aria-label="フッターナビゲーション" className="flex justify-center gap-6 mb-4">
          <Link href="/legal" className="hover:text-pink-500 transition-colors">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-pink-500 transition-colors">プライバシーポリシー</Link>
          <Link href="/pricing" className="hover:text-pink-500 transition-colors">料金</Link>
        </nav>
        <p>© 2025 婚活AI. All rights reserved.</p>
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
