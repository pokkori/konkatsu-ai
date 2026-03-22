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
  const label = score >= 70 ? "脈あり" : score >= 40 ? "様子見" : "厳しめ";
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28" role="img" aria-label={`脈あり度スコア: ${score}%、判定: ${label}`}>
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlanLabel}
          onSuccess={() => { setShowPayjp(false); window.location.reload(); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="paywall-analyze-title">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-red-400" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>
            <h2 id="paywall-analyze-title" className="text-lg font-bold mb-2">無料回数を使い切りました</h2>
            <p className="text-sm text-gray-500 mb-4">返信分析・メッセージ生成を無制限に使うにはプランへのアップグレードが必要です。</p>
            <div className="space-y-3 mb-4">
              <button
                onClick={() => openPayjp("プレミアムプラン ¥1,980/月")}
                aria-label="プレミアムプランに登録して返信分析を続ける"
                className="block w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all hover:shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-100">
                ¥1,980/月 — プレミアムプランで続ける
              </button>
            </div>
            <button
              onClick={() => setShowPaywall(false)}
              aria-label="閉じる"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ナビ — グラスモーフィズム */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-red-100/60 shadow-sm" aria-label="サービスナビゲーション">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="婚活AI トップページへ戻る">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500" aria-hidden="true">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <span className="font-bold text-pink-600">婚活AI</span>
          </Link>
          <span className="text-gray-300" aria-hidden="true">/</span>
          <span className="text-gray-600 text-sm font-medium" aria-current="page">返信分析</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-red-100 text-red-700 rounded-full px-4 py-1 text-sm mb-4 font-medium">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 mr-1.5" aria-hidden="true">
              <path d="M9.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM6.44 6.852A1.5 1.5 0 0 1 7.5 6.5h1a1.5 1.5 0 0 1 1.06.44l2.086 2.085a1.5 1.5 0 0 1 0 2.122l-2.085 2.085a1.5 1.5 0 0 1-2.122 0L5.354 11.15a1.5 1.5 0 0 1 0-2.122L6.44 7.94V6.852Z" />
            </svg>
            返信分析
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            相手の返信を分析して<br />
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">脈あり度を診断</span>
          </h1>
          <p className="text-gray-500">返信の内容から好感度・次のベストアクションをAIが診断</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-pink-100 p-6 space-y-5" aria-label="返信分析フォーム" noValidate>
          <div>
            <label htmlFor="replyText" className="block text-sm font-semibold text-gray-700 mb-2">
              相手からの返信内容 <span className="text-red-400" aria-label="必須">*</span>
            </label>
            <textarea
              id="replyText"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="例：そうなんですね！私もカフェ好きです。最近どこか行きましたか？"
              rows={4}
              required
              aria-required="true"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
            />
          </div>
          <div>
            <label htmlFor="context" className="block text-sm font-semibold text-gray-700 mb-2">
              会話の流れ（任意）
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="例：最初のメッセージからやり取り3回目。カフェの話題で盛り上がっている。"
              rows={2}
              aria-describedby="context-hint"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none"
            />
            <p id="context-hint" className="text-xs text-gray-400 mt-1">より精度の高い診断のために、これまでの会話の流れを教えてください</p>
          </div>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-label={loading ? "AI分析中、お待ちください" : "返信を分析する"}
            aria-busy={loading}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-600 hover:shadow-lg hover:shadow-red-200 hover:scale-[1.01] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                分析中...
              </span>
            ) : "返信を分析する →"}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4" aria-label="分析結果" aria-live="polite">
            {/* 脈あり度メーター */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-red-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">診断結果</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {result.score !== null && <ScoreMeter score={result.score} />}
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z" clipRule="evenodd" />
                    </svg>
                    相手の気持ち・状況
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.feelings}</p>
                </div>
              </div>
            </div>

            {/* ベストメッセージ */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-green-100 p-6">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 14.25 13H8.061l-2.574 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-7.5C0 2.784.784 2 1.75 2ZM1.5 3.75v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Z" clipRule="evenodd" />
                </svg>
                今すぐ送るべきメッセージ
              </h3>
              <div className="bg-green-50/70 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.message}</p>
              </div>
              <button
                onClick={() => copyMessage(result.message)}
                aria-label={copied ? "コピーしました" : "メッセージをクリップボードにコピーする"}
                aria-live="polite"
                className="mt-3 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    コピーしました
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                      <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" clipRule="evenodd" />
                    </svg>
                    メッセージをコピー
                  </>
                )}
              </button>
            </div>

            {/* 注意点 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-amber-100 p-6">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                </svg>
                やってはいけないこと
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.caution}</p>
            </div>

            <button
              onClick={() => { setResult(null); setReplyText(""); setContext(""); }}
              aria-label="フォームをリセットして別の返信を分析する"
              className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              別の返信を分析する
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
