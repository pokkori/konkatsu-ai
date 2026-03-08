"use client";

import { useState } from "react";
import Link from "next/link";

const ANALYZE_LIMIT_KEY = "konkatsu_analyze_used";

function isLimitReached(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ANALYZE_LIMIT_KEY) === "true";
}

async function startCheckout(plan: string) {
  const res = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export default function AnalyzePage() {
  const [replyText, setReplyText] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) {
      setError("相手の返信内容を入力してください。");
      return;
    }
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
      if (data.error === "LIMIT_REACHED") {
        setShowPaywall(true);
        return;
      }
      if (data.error) throw new Error(data.error);
      localStorage.setItem(ANALYZE_LIMIT_KEY, "true");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="text-3xl mb-3">💑</div>
            <h2 className="text-lg font-bold mb-2">無料回数を使い切りました</h2>
            <p className="text-sm text-gray-500 mb-4">返信分析・メッセージ生成を無制限に使うにはプランへのアップグレードが必要です。</p>
            <div className="space-y-3 mb-4">
              <button onClick={() => startCheckout("standard")}
                className="block w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600">
                ¥1,980/月 — スタンダードプランで続ける
              </button>
              <button onClick={() => startCheckout("popular")}
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
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="例：そうなんですね！私もカフェ好きです。最近どこか行きましたか？"
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              会話の流れ（任意）
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="例：最初のメッセージからやり取り3回目。カフェの話題で盛り上がっている。"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                分析中...
              </span>
            ) : (
              "返信を分析する →"
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold text-gray-800">分析結果</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm">
                {result}
              </pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-4 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm hover:bg-red-100 transition-colors"
            >
              📋 コピーする
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
