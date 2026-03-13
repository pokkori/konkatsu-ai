"use client";

import { useState } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

interface AnalyzeResult {
  score: number | null;
  feelings: string;
  message: string;
  caution: string;
}

function ScoreMeter({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "脈あり!" : score >= 40 ? "様子見" : "厳しめ";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}%</span>
        </div>
      </div>
      <span className="text-sm font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: color }}>{label}</span>
    </div>
  );
}

export default function AnalyzePage() {
  const [replyText, setReplyText] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlanLabel, setPayjpPlanLabel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) { setError("相手の返信内容を入力してください。"); return; }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText, context }),
      });
      const data = await res.json();
      if (data.error === "LIMIT_REACHED") { setShowPaywall(true); return; }
      if (data.error) throw new Error(data.error);
      setResult({ score: data.score, feelings: data.feelings, message: data.message, caution: data.caution });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function openPayjp(planLabel: string) {
    setPayjpPlanLabel(planLabel);
    setShowPaywall(false);
    setShowPayjp(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlanLabel}
          onSuccess={() => { setShowPayjp(false); window.location.reload(); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="text-3xl mb-3">💑</div>
            <h2 className="text-lg font-bold mb-2">無料回数を使い切りました</h2>
            <p className="text-sm text-gray-500 mb-4">返信分析・メッセージ生成を無制限に使うにはプランへのアップグレードが必要です。</p>
            <div className="space-y-3 mb-4">
              <button onClick={() => openPayjp("スタンダードプラン ¥1,980/月")}
                className="block w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600">
                ¥1,980/月 — スタンダードプランで続ける
              </button>
              <button onClick={() => openPayjp("モテるプラン ¥3,980/月")}
                className="block w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">
                ¥3,980/月 — モテるプランで全機能解放
              </button>
            </div>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400">閉じる</button>
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
          <span className="text-gray-600 text-sm font-medium">返信分析</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-red-100 text-red-700 rounded-full px-4 py-1 text-sm mb-4">
            🔍 返信分析
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            相手の返信を分析して<br />脈あり度を診断
          </h1>
          <p className="text-gray-500">返信の内容から好感度・次のベストアクションをAIが診断</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              相手からの返信内容 <span className="text-red-400">*</span>
            </label>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
              placeholder="例：そうなんですね！私もカフェ好きです。最近どこか行きましたか？"
              rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">会話の流れ（任意）</label>
            <textarea value={context} onChange={(e) => setContext(e.target.value)}
              placeholder="例：最初のメッセージからやり取り3回目。カフェの話題で盛り上がっている。"
              rows={2} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 shadow-md">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                分析中...
              </span>
            ) : "返信を分析する →"}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4">
            {/* 脈あり度メーター */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">診断結果</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {result.score !== null && <ScoreMeter score={result.score} />}
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <span>💭</span> 相手の気持ち・状況
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.feelings}</p>
                </div>
              </div>
            </div>

            {/* ベストメッセージ */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                <span>💬</span> 今すぐ送るべきメッセージ
              </h3>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.message}</p>
              </div>
              <button onClick={() => copyMessage(result.message)}
                className="mt-3 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                {copied ? "✅ コピーしました" : "📋 メッセージをコピー"}
              </button>
            </div>

            {/* 注意点 */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                <span>⚠️</span> やってはいけないこと
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.caution}</p>
            </div>

            <button onClick={() => { setResult(null); setReplyText(""); setContext(""); }}
              className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors">
              🔄 別の返信を分析する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
