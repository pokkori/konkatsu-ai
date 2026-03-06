"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 1;
const STORAGE_KEY = "konkatsu_profile_count";

async function startCheckout(plan: string) {
  const res = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

const APPS = ["Pairs", "Tinder", "Bumble", "with", "タップル", "その他"];

const GOALS = [
  { id: "appeal", label: "魅力を伝えたい" },
  { id: "natural", label: "自然に見せたい" },
  { id: "match", label: "マッチ数を増やしたい" },
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    app: "Pairs",
    age: "",
    job: "",
    hobbies: "",
    profile: "",
    goals: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status").then((r) => r.json()).then((d) => setIsPremium(d.isPremium));
    setUsageCount(Number(localStorage.getItem(STORAGE_KEY) || "0"));
  }, []);

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.age || !form.job || !form.profile) {
      setError("年齢・職業・プロフィール文は必須です。");
      return;
    }
    if (!isPremium && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goals: form.goals.length > 0 ? form.goals : ["マッチ数を増やしたい"],
        }),
      });
      if (res.status === 429) { setShowPaywall(true); return; }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      const next = data.count ?? usageCount + 1;
      setUsageCount(next);
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">無料枠を使い切りました</h2>
            <p className="text-gray-500 text-sm mb-6">
              無料プランはプロフィール添削1回まで。<br />
              プレミアムプランで無制限に使えます。
            </p>
            <button
              onClick={() => startCheckout("popular")}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all mb-3"
            >
              モテるプランで続ける（¥3,980/月）
            </button>
            <button
              onClick={() => startCheckout("standard")}
              className="w-full border border-pink-300 text-pink-600 py-2 rounded-xl text-sm font-medium hover:bg-pink-50 transition-colors mb-3"
            >
              スタンダードプラン（¥1,980/月）
            </button>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400 hover:text-gray-600">
              閉じる
            </button>
          </div>
        </div>
      )}
      {/* ナビ */}
      <nav className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💑</span>
            <span className="font-bold text-pink-600">婚活AI</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm font-medium">プロフィール添削</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-pink-100 text-pink-700 rounded-full px-4 py-1 text-sm mb-4">
            📝 プロフィール添削
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            AIがプロフィールを<br />劇的改善します
          </h1>
          <p className="text-gray-500">心理学×コピーライティングで、マッチ数平均2.8倍アップを実現</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* フォーム */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 space-y-5">
              {/* アプリ選択 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  使用しているアプリ
                </label>
                <div className="flex flex-wrap gap-2">
                  {APPS.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, app }))}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                        form.app === app
                          ? "border-pink-500 bg-pink-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-pink-300"
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* 年齢・職業 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    年齢 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                    placeholder="28"
                    min={18}
                    max={80}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    職業 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.job}
                    onChange={(e) => setForm((p) => ({ ...p, job: e.target.value }))}
                    placeholder="ITエンジニア"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
              </div>

              {/* 趣味 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">趣味・好きなこと</label>
                <input
                  type="text"
                  value={form.hobbies}
                  onChange={(e) => setForm((p) => ({ ...p, hobbies: e.target.value }))}
                  placeholder="カフェ巡り、映画鑑賞、ヨガ"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              {/* 現在のプロフィール文 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  現在のプロフィール文 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.profile}
                  onChange={(e) => setForm((p) => ({ ...p, profile: e.target.value }))}
                  placeholder="はじめまして！都内でITエンジニアをしています。休日はカフェ巡りや映画をよく見ています。よろしくお願いします。"
                  rows={5}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.profile.length}文字</p>
              </div>

              {/* 改善ポイント */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  改善してほしいポイント（複数選択可）
                </label>
                <div className="flex flex-wrap gap-3">
                  {GOALS.map((goal) => (
                    <label
                      key={goal.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.goals.includes(goal.id)}
                        onChange={() => toggleGoal(goal.id)}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <span className="text-sm text-gray-700">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    AIが分析中...
                  </span>
                ) : (
                  "プロフィールを添削する →"
                )}
              </button>
            </form>
          </div>

          {/* サイドパネル */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">添削の効果</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-pink-500">✓</span> マッチ数が平均2.8倍アップ</li>
                <li className="flex items-start gap-2"><span className="text-pink-500">✓</span> 改善版プロフィール文を即生成</li>
                <li className="flex items-start gap-2"><span className="text-pink-500">✓</span> 改善ポイントを3〜5点解説</li>
                <li className="flex items-start gap-2"><span className="text-pink-500">✓</span> 追加アドバイスも提供</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-5">
              <p className="text-sm text-pink-800 font-medium mb-1">ポイント</p>
              <p className="text-xs text-pink-700 leading-relaxed">
                現在のプロフィール文が短くても大丈夫です。AIが情報を補完しながら魅力的な文章に仕上げます。
              </p>
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold text-gray-800">添削結果</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm bg-gray-50 rounded-xl p-4">
                {result}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-200 px-4 py-2 rounded-xl text-sm hover:bg-pink-100 transition-colors"
              >
                📋 コピーする
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`婚活AIでプロフィールを添削してもらいました！💑 #婚活 #婚活AI https://konkatsu-ai.vercel.app`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                𝕏 でシェア
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(`婚活AIでプロフィールを添削してもらいました！💑 #婚活 https://konkatsu-ai.vercel.app`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#06C755] text-white text-sm font-bold rounded-xl hover:bg-[#05b04c] transition-colors"
              >
                LINE でシェア
              </a>
              <button
                onClick={() => { setResult(null); setForm({ app: "Pairs", age: "", job: "", hobbies: "", profile: "", goals: [] }); }}
                className="flex items-center gap-2 bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                🔄 もう一度
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
