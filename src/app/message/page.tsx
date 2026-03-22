"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const FREE_LIMIT = 3;
const STORAGE_KEY = "konkatsu_message_count";
const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const PURPOSES = [
  {
    id: "first",
    label: "最初のメッセージ",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.289Z" />
      </svg>
    ),
  },
  {
    id: "date",
    label: "デートに誘う",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "reply",
    label: "返信が来た",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const CHARACTERS = [
  {
    id: "bright",
    label: "明るい",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.061ZM5.404 6.464a.75.75 0 0 0 1.06-1.06L5.403 4.343a.75.75 0 0 0-1.06 1.06l1.06 1.061Z" />
      </svg>
    ),
  },
  {
    id: "calm",
    label: "落ち着いた",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "funny",
    label: "面白い",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-7.536 5.879a.75.75 0 0 0 1.06.04 3.498 3.498 0 0 1 4.952 0 .75.75 0 0 0 1.02-1.1 4.998 4.998 0 0 0-7.072 0 .75.75 0 0 0 .04 1.06Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "serious",
    label: "真面目",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
      </svg>
    ),
  },
];

const STEPS = [
  { label: "プロフィールを読み込み中" },
  { label: "アプローチ戦略を立案中" },
  { label: "3パターンを生成中" },
  { label: "文章を磨き上げ中" },
];

interface Pattern {
  name: string;
  text: string;
  why: string;
}

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
        }, [1000, 1500, 2000, 800][idx] ?? 1000);
      }
    }
    advance();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100 p-5 shadow-sm" role="status" aria-live="polite" aria-label="メッセージ生成中">
      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < stepIdx ? "bg-rose-500" : i === stepIdx ? "bg-rose-500 animate-pulse" : "bg-gray-200"
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
        <div className="mt-4 border-t border-rose-50 pt-3">
          <p className="text-xs text-gray-400 mb-1">{streamText.length}文字 生成中...</p>
          <div className="bg-rose-50/60 rounded-xl p-3 max-h-24 overflow-hidden relative">
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{streamText.slice(-200)}</p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-rose-50/60 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagePage() {
  const [form, setForm] = useState({ targetProfile: "", purpose: "first", character: "bright" });
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
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
    setStreamText("");

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
              const next = parsed.count ?? usageCount + 1;
              setUsageCount(next);
              localStorage.setItem(STORAGE_KEY, String(next));
              if (parsed.patterns) setPatterns(parsed.patterns);
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlanLabel}
          onSuccess={() => { setShowPayjp(false); setIsPremium(true); window.location.reload(); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="paywall-msg-title">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="mb-3 flex justify-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-rose-500" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
            </div>
            <h2 id="paywall-msg-title" className="text-xl font-bold text-gray-800 mb-2">無料枠を使い切りました</h2>
            <p className="text-gray-500 text-sm mb-6">
              無料プランはメッセージ生成3回まで。<br />プレミアムプランで無制限に使えます。
            </p>
            <button
              onClick={() => openPayjp("プレミアムプラン ¥1,980/月")}
              aria-label="プレミアムプランに登録してメッセージ生成を続ける"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all mb-3 hover:shadow-lg hover:shadow-rose-200 hover:scale-[1.02] active:scale-100"
            >
              ¥1,980/月 — プレミアムプランで続ける
            </button>
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
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-pink-100/60 shadow-sm" aria-label="サービスナビゲーション">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="婚活AI トップページへ戻る">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500" aria-hidden="true">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <span className="font-bold text-pink-600">婚活AI</span>
          </Link>
          <span className="text-gray-300" aria-hidden="true">/</span>
          <span className="text-gray-600 text-sm font-medium" aria-current="page">メッセージ文案生成</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-rose-100 text-rose-700 rounded-full px-4 py-1 text-sm mb-4 font-medium">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 mr-1.5" aria-hidden="true">
              <path fillRule="evenodd" d="M3.43 1.814A.75.75 0 0 1 4 1.75h8a.75.75 0 0 1 .748.814l-.358 3.582A1.5 1.5 0 0 1 10.903 7.5H5.097a1.5 1.5 0 0 1-1.487-1.354L3.25 2.564A.75.75 0 0 1 3.43 1.814ZM8 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" clipRule="evenodd" />
            </svg>
            メッセージ文案生成
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            返信率を上げる<br />
            <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">メッセージを3パターン生成</span>
          </h1>
          <p className="text-gray-500">相手のプロフィールを分析して、今すぐコピーして使える文案を提案</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-pink-100 p-6 space-y-5" aria-label="メッセージ生成フォーム" noValidate>
              <div>
                <label htmlFor="targetProfile" className="block text-sm font-semibold text-gray-700 mb-2">
                  相手のプロフィール情報 <span className="text-red-400" aria-label="必須">*</span>
                </label>
                <textarea
                  id="targetProfile"
                  value={form.targetProfile}
                  onChange={(e) => setForm((p) => ({ ...p, targetProfile: e.target.value }))}
                  placeholder="例：趣味はカフェ巡りと映画鑑賞。週末はヨガに通っています。旅行が好きで去年は京都と沖縄に行きました。仕事は看護師をしています。穏やかな人が好きです。"
                  rows={5}
                  required
                  aria-required="true"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">プロフィールに書かれている内容をコピーして貼り付けてください</p>
              </div>

              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-2">メッセージの目的</legend>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="メッセージの目的を選択">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, purpose: p.id }))}
                      aria-pressed={form.purpose === p.id}
                      aria-label={p.label}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                        form.purpose === p.id
                          ? "border-rose-400 bg-rose-50 text-rose-700 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50/50"
                      }`}
                    >
                      {p.icon}
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-2">自分のキャラクター</legend>
                <div className="grid grid-cols-4 gap-2" role="group" aria-label="自分のキャラクターを選択">
                  {CHARACTERS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, character: c.id }))}
                      aria-pressed={form.character === c.id}
                      aria-label={c.label}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                        form.character === c.id
                          ? "border-pink-400 bg-pink-50 text-pink-700 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
                      }`}
                    >
                      {c.icon}
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-label={loading ? "AI処理中、お待ちください" : "メッセージを生成する"}
                aria-busy={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:shadow-rose-200 hover:scale-[1.01] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            {loading ? (
              <StreamingIndicator streamText={streamText} />
            ) : (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 p-5 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-3">生成されるもの</h2>
                  <ul className="space-y-2 text-sm text-gray-600" role="list">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">①</span>
                      3パターンのメッセージ文案
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">②</span>
                      各パターンのアプローチ名
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">③</span>
                      ワンタップでコピー可能
                    </li>
                  </ul>
                </div>
                {!isPremium && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-100 p-5 shadow-sm" aria-label="残り無料回数">
                    <p className="text-xs text-pink-600 font-medium mb-1">残り無料回数</p>
                    <p className="text-2xl font-bold text-pink-600">
                      {Math.max(0, FREE_LIMIT - usageCount)}
                      <span className="text-sm font-normal text-pink-400"> / 3回</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 3カード表示 */}
        {patterns && patterns.length > 0 && !loading && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              生成されたメッセージ文案
            </h2>
            <div className="grid gap-4">
              {patterns.map((p, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-rose-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">パターン {i + 1}</span>
                      <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                    </div>
                    <button
                      onClick={() => copyText(p.text, i)}
                      aria-label={copiedIdx === i ? "コピーしました" : `パターン${i + 1}のメッセージをコピーする`}
                      aria-live="polite"
                      className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-50"
                    >
                      {copiedIdx === i ? (
                        <>
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                          </svg>
                          コピー済み
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" clipRule="evenodd" />
                          </svg>
                          コピー
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-rose-50/70 rounded-xl p-4 mb-3">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{p.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-medium text-gray-600">効果的な理由：</span>{p.why}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setPatterns(null); setForm({ targetProfile: "", purpose: "first", character: "bright" }); setStreamText(""); }}
              aria-label="フォームをリセットしてもう一度メッセージを生成する"
              className="mt-4 w-full py-3 border-2 border-rose-200 text-rose-500 rounded-xl font-medium hover:bg-rose-50 transition-colors"
            >
              もう一度生成する
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
