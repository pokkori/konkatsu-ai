"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const FREE_LIMIT = 3;
const STORAGE_KEY = "konkatsu_message_count";
const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const PURPOSES = [
  { id: "first", label: "最初のメッセージ", emoji: "👋" },
  { id: "date", label: "デートに誘う", emoji: "🍽️" },
  { id: "reply", label: "返信が来た", emoji: "💬" },
];

const CHARACTERS = [
  { id: "bright", label: "明るい", emoji: "😄" },
  { id: "calm", label: "落ち着いた", emoji: "😌" },
  { id: "funny", label: "面白い", emoji: "😂" },
  { id: "serious", label: "真面目", emoji: "🎓" },
];

interface Pattern {
  name: string;
  text: string;
  why: string;
}

export default function MessagePage() {
  const [form, setForm] = useState({ targetProfile: "", purpose: "first", character: "bright" });
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[] | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlanLabel, setPayjpPlanLabel] = useState("");

  useEffect(() => {
    fetch("/api/auth/status").then((r) => r.json()).then((d) => setIsPremium(d.isPremium));
    setUsageCount(Number(localStorage.getItem(STORAGE_KEY) || "0"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.targetProfile) { setError("相手のプロフィール情報を入力してください。"); return; }
    if (!isPremium && usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setError(null);
    setLoading(true);
    setPatterns(null);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error === "LIMIT_REACHED") { setShowPaywall(true); return; }
      if (data.error) throw new Error(data.error);
      setPatterns(data.patterns);
      const next = usageCount + 1;
      setUsageCount(next);
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  function openPayjp(planLabel: string) {
    setPayjpPlanLabel(planLabel);
    setShowPaywall(false);
    setShowPayjp(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlanLabel}
          onSuccess={() => { setShowPayjp(false); setIsPremium(true); window.location.reload(); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">無料枠を使い切りました</h2>
            <p className="text-gray-500 text-sm mb-6">
              無料プランはメッセージ生成3回まで。<br />プレミアムプランで無制限に使えます。
            </p>
            <button onClick={() => openPayjp("モテるプラン ¥3,980/月")}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all mb-3">
              モテるプランで続ける（¥3,980/月）
            </button>
            <button onClick={() => openPayjp("スタンダードプラン ¥1,980/月")}
              className="w-full border border-pink-300 text-pink-600 py-2 rounded-xl text-sm font-medium hover:bg-pink-50 transition-colors mb-3">
              スタンダードプラン（¥1,980/月）
            </button>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
          </div>
        </div>
      )}

      <nav className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💑</span>
            <span className="font-bold text-pink-600">婚活AI</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm font-medium">メッセージ文案生成</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-rose-100 text-rose-700 rounded-full px-4 py-1 text-sm mb-4">
            💌 メッセージ文案生成
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            返信率を上げる<br />メッセージを3パターン生成
          </h1>
          <p className="text-gray-500">相手のプロフィールを分析して、今すぐコピーして使える文案を提案</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  相手のプロフィール情報 <span className="text-red-400">*</span>
                </label>
                <textarea value={form.targetProfile}
                  onChange={(e) => setForm((p) => ({ ...p, targetProfile: e.target.value }))}
                  placeholder="例：趣味はカフェ巡りと映画鑑賞。週末はヨガに通っています。旅行が好きで去年は京都と沖縄に行きました。仕事は看護師をしています。穏やかな人が好きです。"
                  rows={5} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none" />
                <p className="text-xs text-gray-400 mt-1">プロフィールに書かれている内容をコピーして貼り付けてください</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">メッセージの目的</label>
                <div className="grid grid-cols-3 gap-2">
                  {PURPOSES.map((p) => (
                    <button key={p.id} type="button" onClick={() => setForm((prev) => ({ ...prev, purpose: p.id }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors text-sm ${
                        form.purpose === p.id ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-200 text-gray-600 hover:border-rose-200"}`}>
                      <span className="text-xl">{p.emoji}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">自分のキャラクター</label>
                <div className="grid grid-cols-4 gap-2">
                  {CHARACTERS.map((c) => (
                    <button key={c.id} type="button" onClick={() => setForm((prev) => ({ ...prev, character: c.id }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors text-sm ${
                        form.character === c.id ? "border-pink-400 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-600 hover:border-pink-200"}`}>
                      <span className="text-xl">{c.emoji}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    AIが考え中...
                  </span>
                ) : "メッセージを生成する →"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">生成されるもの</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-rose-500">①</span> 3パターンのメッセージ文案</li>
                <li className="flex items-start gap-2"><span className="text-rose-500">②</span> 各パターンのアプローチ名</li>
                <li className="flex items-start gap-2"><span className="text-rose-500">③</span> ワンタップでコピー可能</li>
              </ul>
            </div>
            {!isPremium && (
              <div className="bg-pink-50 rounded-2xl border border-pink-100 p-5">
                <p className="text-xs text-pink-600 font-medium mb-1">残り無料回数</p>
                <p className="text-2xl font-bold text-pink-600">{Math.max(0, FREE_LIMIT - usageCount)}<span className="text-sm font-normal text-pink-400"> / 3回</span></p>
              </div>
            )}
          </div>
        </div>

        {/* 3カード表示 */}
        {patterns && patterns.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💌</span> 生成されたメッセージ文案
            </h2>
            <div className="grid gap-4">
              {patterns.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">パターン {i + 1}</span>
                      <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                    </div>
                    <button onClick={() => copyText(p.text, i)}
                      className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-50">
                      {copiedIdx === i ? "✅ コピー済み" : "📋 コピー"}
                    </button>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4 mb-3">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{p.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-medium text-gray-600">効果的な理由：</span>{p.why}
                  </p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPatterns(null); setForm({ targetProfile: "", purpose: "first", character: "bright" }); }}
              className="mt-4 w-full py-3 border-2 border-rose-200 text-rose-500 rounded-xl font-medium hover:bg-rose-50 transition-colors">
              🔄 もう一度生成する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
