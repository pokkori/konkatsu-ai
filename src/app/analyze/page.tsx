"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

interface AnalyzeResult {
  score: number | null;
  feelings: string;
  message: string;
  caution: string;
}

const STEPS = [
  { label: "返信内容を解析中", duration: 1000 },
  { label: "感情パターンを読み取り中", duration: 1500 },
  { label: "脈あり度を算出中", duration: 1800 },
  { label: "次のメッセージを考案中", duration: 900 },
];

function StreamingIndicator({ streamText }: { streamText: string }) {
  const [stepIdx, setStepIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let idx = 0;
    function advance() {
      if (idx < STEPS.length - 1) {
        timerRef.current = setTimeout(() => {
          idx++;
          setStepIdx(idx);
          advance();
        }, STEPS[idx].duration);
      }
    }
    advance();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div
      className="bg-white/80 backdrop-blur-xl rounded-3xl border border-red-100 p-6 shadow-sm space-y-5"
      role="status"
      aria-live="polite"
      aria-label="AI分析中"
    >
      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < stepIdx ? "bg-red-500" : i === stepIdx ? "bg-red-500 animate-pulse" : "bg-gray-200"
            }`}>
              {i < stepIdx ? (
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5 text-white" aria-hidden="true">
                  <path d="M3.707 5.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L5 6.586 3.707 5.293z" />
                </svg>
              ) : i === stepIdx ? (
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : null}
            </div>
            <span className={`text-sm transition-colors duration-300 ${i <= stepIdx ? "text-gray-800 font-medium" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {streamText.length > 0 && (
        <div className="border-t border-red-50 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>分析中...</span>
            <span>{streamText.length}文字</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 max-h-28 overflow-hidden relative">
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-5">{streamText}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
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
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlanLabel, setPayjpPlanLabel] = useState("");
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ replyText: string; score: number | null; feelings: string; timestamp: string }>>([]);

  useEffect(() => {
    setStreak(loadStreak("konkatsu"));
    try {
      const stored = localStorage.getItem("konkatsu_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* noop */ }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) { setError("相手の返信内容を入力してください。"); return; }
    setError(null);
    setLoading(true);
    setResult(null);
    setStreamText("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText, context }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "LIMIT_REACHED") { setShowPaywall(true); return; }
        throw new Error(data.error || "リクエストが多すぎます。");
      }

      if (!res.body) throw new Error("ストリームを取得できませんでした。");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.type === "delta") {
              setStreamText((prev) => prev + parsed.text);
            } else if (parsed.type === "done") {
              const newResult = {
                score: parsed.score,
                feelings: parsed.feelings,
                message: parsed.message,
                caution: parsed.caution,
              };
              setResult(newResult);
              // ストリーク更新
              const s = updateStreak("konkatsu");
              setStreak(s);
              const msg = getStreakMilestoneMessage(s.count);
              if (msg) setStreakMsg(msg);
              // 分析履歴保存
              try {
                const stored = localStorage.getItem("konkatsu_history");
                const prev: Array<{ replyText: string; score: number | null; feelings: string; timestamp: string }> = stored ? JSON.parse(stored) : [];
                const next = [{ replyText, score: parsed.score, feelings: parsed.feelings, timestamp: new Date().toLocaleString("ja-JP") }, ...prev].slice(0, 5);
                localStorage.setItem("konkatsu_history", JSON.stringify(next));
                setHistory(next);
              } catch { /* noop */ }
              setLoading(false);
              return;
            } else if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          } catch {
            // JSON parse error — skip
          }
        }
      }
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
                className="block w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all hover:shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-100"
              >
                ¥1,980/月 — プレミアムプランで続ける
              </button>
            </div>
            <button
              onClick={() => setShowPaywall(false)}
              aria-label="ペイウォールを閉じる"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ナビ — グラスモーフィズム強化 */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-red-100/60 shadow-sm"
        aria-label="サービスナビゲーション"
      >
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

      <main className="max-w-3xl mx-auto px-4 py-10" aria-label="返信分析ツール">
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
          {streak && streak.count > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1 text-sm">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-pink-500" aria-hidden="true">
                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <span className="text-pink-700 font-medium">{streak.count}日連続利用中</span>
            </div>
          )}
          {streakMsg && (
            <div role="alert" aria-live="polite" className="mt-2 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-full px-3 py-1 text-sm text-yellow-700 font-medium">
              {streakMsg}
            </div>
          )}
        </div>

        {/* フォーム — グラスモーフィズム強化 */}
        <section aria-labelledby="analyze-form-heading">
          <h2 id="analyze-form-heading" className="sr-only">返信分析フォーム</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md border border-white/40 p-6 space-y-5"
            aria-label="返信分析フォーム"
            noValidate
          >
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
                aria-describedby="replyText-hint"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none bg-white/80"
              />
              <p id="replyText-hint" className="text-xs text-gray-400 mt-1">相手から受け取ったメッセージをそのまま貼り付けてください</p>
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
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors resize-none bg-white/80"
              />
              <p id="context-hint" className="text-xs text-gray-400 mt-1">より精度の高い診断のために、これまでの会話の流れを教えてください</p>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-label={loading ? "AI分析中、お待ちください" : "返信を分析する"}
              aria-busy={loading}
              className="w-full min-h-[52px] bg-gradient-to-r from-red-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-rose-600 hover:shadow-lg hover:shadow-red-200 hover:scale-[1.01] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
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
        </section>

        {/* Streaming インジケーター */}
        {loading && (
          <div className="mt-6">
            <StreamingIndicator streamText={streamText} />
          </div>
        )}

        {/* 分析結果 */}
        {result && !loading && (
          <div className="mt-8 space-y-4" aria-label="分析結果" aria-live="polite">
            {/* 脈あり度メーター */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md border border-white/40 p-6">
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
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md border border-green-100/60 p-6">
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
                className="mt-3 min-h-[44px] flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-green-50"
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
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md border border-amber-100/60 p-6">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                </svg>
                やってはいけないこと
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.caution}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("婚活AIでパートナー探しのアドバイスをもらいました！ #婚活AI #婚活 https://konkatsu-ai.vercel.app")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="婚活AIのアドバイスをXにシェアする（新しいタブで開きます）"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xでシェア
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://konkatsu-ai.vercel.app")}&text=${encodeURIComponent("婚活AIでパートナー探しのアドバイスをもらいました！パートナーとも共有しよう #婚活AI #婚活")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="婚活AIのアドバイスをLINEでパートナーに共有する（新しいタブで開きます）"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.124 2 11.207c0 2.816 1.394 5.312 3.567 6.949-.157.584-.509 2.125-.584 2.453-.09.397.145.39.305.284.125-.083 1.978-1.301 2.78-1.831.636.09 1.293.138 1.932.138 5.523 0 10-4.124 10-9.207C20 6.124 17.523 2 12 2z"/></svg>
                LINEでシェア
              </a>
              <button
                onClick={() => { setResult(null); setReplyText(""); setContext(""); setStreamText(""); }}
                aria-label="フォームをリセットして別の返信を分析する"
                className="flex-1 min-h-[44px] py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                別の返信を分析する
              </button>
            </div>
          </div>
        )}

        {/* 分析履歴パネル */}
        {history.length > 0 && (
          <section aria-labelledby="history-heading" className="mt-10">
            <h2 id="history-heading" className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-pink-400" aria-hidden="true">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7-6.75a6.75 6.75 0 1 0 0 13.5A6.75 6.75 0 0 0 8 1.25ZM8.75 5.5a.75.75 0 0 0-1.5 0v2.75H5.5a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 .75-.75V5.5Z" clipRule="evenodd"/>
              </svg>
              過去の分析履歴
            </h2>
            <div className="space-y-3">
              {history.map((item, idx) => {
                const scoreColor = item.score !== null ? (item.score >= 70 ? "text-green-600" : item.score >= 40 ? "text-amber-600" : "text-red-500") : "text-gray-500";
                const scoreLabel = item.score !== null ? (item.score >= 70 ? "脈あり" : item.score >= 40 ? "様子見" : "厳しめ") : "-";
                return (
                  <div
                    key={idx}
                    className="backdrop-blur-sm bg-white/80 border border-white/40 rounded-2xl p-4 shadow-sm"
                    aria-label={`履歴${idx + 1}: ${item.timestamp} スコア${item.score ?? "-"}%`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                      {item.score !== null && (
                        <span className={`text-sm font-bold ${scoreColor}`}>{item.score}% — {scoreLabel}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{item.replyText}</p>
                    {item.feelings && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.feelings}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
