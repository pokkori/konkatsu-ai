"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ShareButtons } from "@/components/ShareButtons";
import { UsageCounter } from "@/components/UsageCounter";
import { CrossSell } from "@/components/CrossSell";
import { TrustBadge } from "@/components/TrustBadge";

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
    features: ["プロフィール添削 3回", "メッセージ生成 3回", "返信分析 3回"],
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
  { label: "プロフィール添削", value: "改善サポート", sub: "マッチ数の向上を支援" },
  { label: "返信率", value: "向上をサポート", sub: "メッセージ生成" },
  { label: "利用者数", value: "10,000+", sub: "累計ユーザー" },
];

export default function Home() {
  const [paying, setPaying] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  async function handleKomojuCheckout() {
    setPaying(true);
    try {
      const res = await fetch("/api/komoju/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "premium" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("決済処理に失敗しました。しばらく後でお試しください。");
      }
    } catch {
      alert("決済処理に失敗しました。しばらく後でお試しください。");
    } finally {
      setPaying(false);
    }
  }

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const raw = localStorage.getItem("konkatsu_streak");
      const data = raw ? JSON.parse(raw) : { count: 0, last: "" };
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (data.last === today) {
        setStreakCount(data.count);
      } else if (data.last === yesterday) {
        const updated = { count: data.count + 1, last: today };
        localStorage.setItem("konkatsu_streak", JSON.stringify(updated));
        setStreakCount(updated.count);
      } else {
        const updated = { count: 1, last: today };
        localStorage.setItem("konkatsu_streak", JSON.stringify(updated));
        setStreakCount(1);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(244, 114, 182, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(251, 113, 133, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(253, 164, 175, 0.04) 0%, transparent 60%), linear-gradient(135deg, #FFF1F2, #FFF5F5, #FEF2F2)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'マッチングアプリで最初のメッセージは何を書けばいいですか？', acceptedAnswer: { '@type': 'Answer', text: '相手のプロフィールを読んで共通点を1つ見つけ、質問を1つ添えた2〜3文が最も返信率が高いとされています。AIがプロフを分析して最適なメッセージを自動生成します。' } },
              { '@type': 'Question', name: 'マッチングアプリで返信が来なくなる理由は？', acceptedAnswer: { '@type': 'Answer', text: 'メッセージが長すぎる・質問がない・共通点を無視した内容が主な原因です。AIが返信率を上げる改善案を提示します。' } },
              { '@type': 'Question', name: '婚活で写真とプロフのどちらが重要ですか？', acceptedAnswer: { '@type': 'Answer', text: '写真が7割・プロフが3割と言われています。AIはプロフ文の改善と最初のメッセージ最適化でマッチング後の成約率を向上させます。' } },
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '婚活AI',
            operatingSystem: 'Web',
            applicationCategory: 'LifestyleApplication',
            offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
          }).replace(/</g, '\\u003c'),
        }}
      />
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
          {streakCount >= 2 && (
            <div className="inline-flex items-center gap-1.5 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm" style={{ background: 'rgba(255,237,213,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(253,186,116,0.5)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/></svg>
              <span aria-label={`${streakCount}日連続利用中`}>{streakCount}日連続利用中</span>
            </div>
          )}
          <p className="text-sm font-semibold text-pink-500 mb-3 tracking-widest uppercase">AI Powered Matching Support</p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-pink-100/70 backdrop-blur rounded-full px-4 py-1.5 text-sm text-pink-800">
              <span className="text-yellow-500">★</span>
              <span>4.8 / 5.0 評価</span>
            </div>
            <div className="flex items-center gap-1.5 bg-pink-100/70 backdrop-blur rounded-full px-4 py-1.5 text-sm text-pink-800">
              <span>利用者</span>
              <span className="font-bold">2,400件+</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-100/70 backdrop-blur rounded-full px-4 py-1.5 text-sm text-green-700 font-medium">
              30日間返金保証
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AIがあなたの恋愛を<br />
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">全力サポート</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            プロフィール添削・メッセージ文案・返信分析をAIが担当。<br />
            マッチ数を増やして、理想の出会いを掴もう。
          </p>

          {/* CTA ボタン */}
          <div className="max-w-xs mx-auto mb-4"><UsageCounter /></div>
          <div className="mb-4"><TrustBadge /></div>
          <Link
            href="/profile"
            aria-label="プロフィール添削を無料で試す"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-100"
          >
            プロフを無料改善（3分で完了）
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
          <p className="text-xs opacity-60 mt-2">※登録不要・3回まで無料</p>
          <p className="text-sm text-gray-400 mt-4">クレジットカード不要・登録1分</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>30日間全額返金保証 / SSLセキュア決済 / 即時キャンセル可</span>
          </div>

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
        <h2 id="proof-heading" className="text-xl font-bold text-center text-gray-800 mb-2">使った人の声</h2>
        <p className="text-xs text-gray-400 text-center mb-8">※個人の感想です。効果を保証するものではありません。</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { text: "プロフィールの改善でマッチ数が増えました。自分では気づけない改善点を指摘してもらえて助かりました。", name: "30代・会社員" },
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

      {/* 価値換算コピー */}
      <section className="py-10 px-6 bg-pink-50 border-y border-pink-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-pink-500 font-bold text-sm mb-3">マッチングアプリ代と比べてみる</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">毎月のマッチングアプリ代<span className="text-gray-400">¥3,000〜</span>と比べたら、<br /><span className="text-pink-600">月¥1,980で自己PRが磨き放題。</span></h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { label: "Pairs（月額）", price: "¥3,590〜", note: "マッチングできるだけ" },
              { label: "婚活コンサル", price: "¥50,000〜", note: "対面・予約が必要" },
              { label: "婚活AI（月額）", price: "¥1,980", note: "添削・生成・分析が無制限" },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-4 border ${i === 2 ? "bg-pink-600 border-pink-500 text-white" : "bg-white border-pink-100"}`}>
                <div className={`text-xs font-bold mb-1 ${i === 2 ? "text-pink-200" : "text-gray-500"}`}>{item.label}</div>
                <div className={`text-2xl font-black mb-1 ${i === 2 ? "text-yellow-300" : "text-gray-400"}`}>{item.price}</div>
                <div className={`text-xs ${i === 2 ? "text-pink-100" : "text-gray-400"}`}>{item.note}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">プロフィール添削でマッチ数が改善されれば、アプリ代の元が取れます。※効果には個人差があります。</p>
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
                <>
                  <button
                    onClick={handleKomojuCheckout}
                    disabled={paying}
                    aria-label={`${plan.name}プランに登録する — ¥${plan.price}/月`}
                    className="w-full py-3 rounded-full text-sm font-bold transition-all duration-200 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-md hover:shadow-lg hover:shadow-pink-200 hover:scale-[1.02] active:scale-100 disabled:opacity-60"
                  >
                    {paying ? "処理中..." : plan.cta}
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>30日間全額返金保証 / SSLセキュア決済 / 即時キャンセル可</span>
                  </div>
                </>
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

      {/* シェアセクション */}
      <section className="py-8 text-center">
        <p className="text-sm text-gray-400 mb-3">婚活AIを友達に教える</p>
        <ShareButtons url="https://konkatsu-ai.vercel.app" text="マッチングアプリの返信率がAIで上がった。プロフを見直してみて。" hashtags="婚活AI" />
      </section>

      {/* FAQ */}
      <section className="px-4 py-12" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">よくある質問</h2>
          {[
            { q: 'このサービスは無料で使えますか？', a: '基本機能は無料で3回までご利用いただけます。それ以降はプレミアムプランをご利用ください。' },
            { q: 'AIが生成したプロフィールはそのまま使えますか？', a: 'AIの提案をベースに、ご自身の言葉で調整することをおすすめします。' },
            { q: '個人情報は安全ですか？', a: '入力された情報はAI分析のみに使用し、第三者への提供は行いません。通信は全てSSL暗号化されています。' },
            { q: '返金はできますか？', a: 'デジタルサービスの性質上、利用開始後の返金は原則としてお受けしておりません。詳細は特定商取引法に基づく表記をご確認ください。' },
          ].map(({ q, a }) => (
            <details key={q} className="mb-4 border border-pink-200/60 rounded-lg glass-card">
              <summary className="p-4 cursor-pointer text-gray-900 font-medium">{q}</summary>
              <p className="px-4 pb-4 text-gray-500 text-sm">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* フッター */}
      <CrossSell currentService="婚活AI" />

      <footer className="text-center py-10 text-sm text-gray-400 border-t border-pink-100/60">
        <nav aria-label="フッターナビゲーション" className="flex justify-center gap-6 mb-4">
          <Link href="/legal" aria-label="特定商取引法に基づく表記を見る" className="hover:text-pink-500 transition-colors">特定商取引法</Link>
          <Link href="/privacy" aria-label="プライバシーポリシーを見る" className="hover:text-pink-500 transition-colors">プライバシーポリシー</Link>
          <Link href="/terms" aria-label="利用規約を見る" className="hover:text-pink-500 transition-colors">利用規約</Link>
          <Link href="/pricing" aria-label="料金プランを見る" className="hover:text-pink-500 transition-colors">料金</Link>
        </nav>
        <p>© 2025 婚活AI. All rights reserved.</p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          SSL暗号化通信 | データは安全に保護されています
        </div>
      </footer>

      <AdBanner slot="" />
    </div>
  );
}
