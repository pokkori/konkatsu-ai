"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";
import { updateStreak, loadStreak } from "@/lib/streak";

const FREE_LIMIT = 3;
const STORAGE_KEY = "konkatsu_profile_count";
const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const APPS = ["Pairs", "Tinder", "Bumble", "with", "タップル", "その他"];

const GOALS = [
  { id: "appeal", label: "魅力を伝えたい" },
  { id: "natural", label: "自然に見せたい" },
  { id: "match", label: "マッチ数を増やしたい" },
];

// Streaming progress steps
const STEPS = [
  { label: "プロフィールを解析中", duration: 1200 },
  { label: "改善ポイントを抽出中", duration: 1800 },
  { label: "添削文を生成中", duration: 2000 },
  { label: "アドバイスを最適化中", duration: 800 },
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

  const charCount = streamText.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 space-y-5" role="status" aria-live="polite" aria-label="AI処理中">
      {/* ステップインジケーター */}
      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < stepIdx ? "bg-pink-500" : i === stepIdx ? "bg-pink-500 animate-pulse" : "bg-gray-200"
            }`}>
              {i < stepIdx ? (
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5 text-white" aria-hidden="true">
                  <path d="M3.707 5.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L5 6.586 3.707 5.293z" />
                </svg>
              ) : i === stepIdx ? (
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : null}
            </div>
            <span className={`text-sm transition-colors duration-300 ${
              i <= stepIdx ? "text-gray-800 font-medium" : "text-gray-400"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* リアルタイム文字数カウンター */}
      {charCount > 0 && (
        <div className="border-t border-pink-50 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>生成中...</span>
            <span>{charCount}文字</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-hidden relative">
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-5">{streamText}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlanLabel, setPayjpPlanLabel] = useState("");
  const [copied, setCopied] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/status").then((r) => r.json()).then((d) => setIsPremium(d.isPremium));
    setUsageCount(Number(localStorage.getItem(STORAGE_KEY) || "0"));
    const s = loadStreak("konkatsu");
    setStreakCount(s.count);
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
    setStreamText("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goals: form.goals.length > 0 ? form.goals : ["マッチ数を増やしたい"],
        }),
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
      let accumulated = "";

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
              accumulated += parsed.text;
              setStreamText(accumulated);
            } else if (parsed.type === "done") {
              const next = parsed.count ?? usageCount + 1;
              setUsageCount(next);
              localStorage.setItem(STORAGE_KEY, String(next));
              setResult(accumulated);
              setLoading(false);
              const s = updateStreak("konkatsu");
              setStreakCount(s.count);
              return;
            } else if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          } catch {
            // JSON parse error — skip
          }
        }
      }

      // フォールバック: ストリームが閉じた場合
      if (accumulated) setResult(accumulated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  function openPayjp(planLabel: string) {
    setPayjpPlanLabel(planLabel);
    setShowPaywall(false);
    setShowPayjp(true);
  }

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlanLabel}
          onSuccess={() => { setShowPayjp(false); setIsPremium(true); window.location.reload(); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="mb-3 flex justify-center">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-pink-500" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
            </div>
            <h2 id="paywall-title" className="text-xl font-bold text-gray-800 mb-2">無料枠を使い切りました</h2>
            <p className="text-gray-500 text-sm mb-6">
              無料プランはプロフィール添削3回まで。<br />
              プレミアムプランで無制限に使えます。
            </p>
            <button
              onClick={() => openPayjp("プレミアムプラン ¥1,980/月")}
              aria-label="プレミアムプランに登録してプロフィール添削を続ける"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all mb-3 hover:shadow-lg hover:shadow-pink-200 hover:scale-[1.02] active:scale-100"
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
      <nav className="sticky top-0 z-40 glass-nav border-b border-pink-100/50 shadow-sm" aria-label="サービスナビゲーション">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="婚活AI トップページへ戻る">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500" aria-hidden="true">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <span className="font-bold text-pink-600">婚活AI</span>
          </Link>
          <span className="text-gray-300" aria-hidden="true">/</span>
          <span className="text-gray-600 text-sm font-medium" aria-current="page">プロフィール添削</span>
          {streakCount >= 2 && (
            <span className="ml-auto text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full" aria-label={`${streakCount}日連続利用中`}>
              {streakCount}日連続
            </span>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-pink-100 text-pink-700 rounded-full px-4 py-1 text-sm mb-4 font-medium">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 mr-1.5" aria-hidden="true">
              <path d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
            </svg>
            プロフィール添削
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            AIがプロフィールを<br />
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">劇的改善します</span>
          </h1>
          <p className="text-gray-500">心理学×コピーライティングで、マッチ数平均2.8倍アップを実現</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* フォーム */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl shadow-md border-pink-100/60 p-6 space-y-5" aria-label="プロフィール添削フォーム" noValidate>
              {/* アプリ選択 */}
              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-2">
                  使用しているアプリ
                </legend>
                <div className="flex flex-wrap gap-2" role="group" aria-label="マッチングアプリ選択">
                  {APPS.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, app }))}
                      aria-pressed={form.app === app}
                      aria-label={`${app}を選択`}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-all duration-200 ${
                        form.app === app
                          ? "border-pink-500 bg-pink-500 text-white shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 年齢・職業 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                    年齢 <span className="text-red-400" aria-label="必須">*</span>
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                    placeholder="28"
                    min={18}
                    max={80}
                    required
                    aria-required="true"
                    aria-describedby="age-hint"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="job" className="block text-sm font-semibold text-gray-700 mb-2">
                    職業 <span className="text-red-400" aria-label="必須">*</span>
                  </label>
                  <input
                    id="job"
                    type="text"
                    value={form.job}
                    onChange={(e) => setForm((p) => ({ ...p, job: e.target.value }))}
                    placeholder="ITエンジニア"
                    required
                    aria-required="true"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
              </div>

              {/* 趣味 */}
              <div>
                <label htmlFor="hobbies" className="block text-sm font-semibold text-gray-700 mb-2">趣味・好きなこと</label>
                <input
                  id="hobbies"
                  type="text"
                  value={form.hobbies}
                  onChange={(e) => setForm((p) => ({ ...p, hobbies: e.target.value }))}
                  placeholder="カフェ巡り、映画鑑賞、ヨガ"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              {/* 現在のプロフィール文 */}
              <div>
                <label htmlFor="profile" className="block text-sm font-semibold text-gray-700 mb-2">
                  現在のプロフィール文 <span className="text-red-400" aria-label="必須">*</span>
                </label>
                <textarea
                  id="profile"
                  value={form.profile}
                  onChange={(e) => setForm((p) => ({ ...p, profile: e.target.value }))}
                  placeholder="はじめまして！都内でITエンジニアをしています。休日はカフェ巡りや映画をよく見ています。よろしくお願いします。"
                  rows={5}
                  required
                  aria-required="true"
                  aria-describedby="profile-count"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
                <p id="profile-count" className="text-xs text-gray-400 mt-1" aria-live="polite">{form.profile.length}文字</p>
              </div>

              {/* 改善ポイント */}
              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-2">
                  改善してほしいポイント（複数選択可）
                </legend>
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
                        aria-label={goal.label}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <span className="text-sm text-gray-700">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-label={loading ? "AI処理中、お待ちください" : "プロフィールを添削する"}
                aria-busy={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 hover:shadow-lg hover:shadow-pink-200 hover:scale-[1.01] active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <div className="glass-card rounded-3xl border-pink-100/60 p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-3">添削の効果</h2>
              <ul className="space-y-2 text-sm text-gray-600" role="list">
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  マッチ数が平均2.8倍アップ
                </li>
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  改善版プロフィール文を即生成
                </li>
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  改善ポイントを3〜5点解説
                </li>
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  追加アドバイスも提供
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-5">
              <p className="text-sm text-pink-800 font-medium mb-1">ポイント</p>
              <p className="text-xs text-pink-700 leading-relaxed">
                現在のプロフィール文が短くても大丈夫です。AIが情報を補完しながら魅力的な文章に仕上げます。
              </p>
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
          </div>
        </div>

        {/* Streaming インジケーター */}
        {loading && (
          <div className="mt-8">
            <StreamingIndicator streamText={streamText} />
          </div>
        )}

        {/* 結果表示 */}
        {result && !loading && (
          <div className="mt-8 glass-card rounded-3xl shadow-md border border-green-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-green-600" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">添削結果</h2>
            </div>
            <div aria-label="AI添削結果">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm bg-gray-50 rounded-xl p-4">
                {result}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={copyResult}
                aria-label={copied ? "コピーしました" : "添削結果をクリップボードにコピーする"}
                aria-live="polite"
                className="flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-200 px-4 py-2 rounded-xl text-sm hover:bg-pink-100 transition-colors"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    コピーしました
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    コピーする
                  </>
                )}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`婚活AIでプロフィールを添削してもらいました！#婚活 #婚活AI https://konkatsu-ai.vercel.app`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="添削結果をXでシェアする（新しいタブで開きます）"
                className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                でシェア
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(`婚活AIでプロフィールを添削してもらいました！#婚活 https://konkatsu-ai.vercel.app`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="添削結果をLINEでシェアする（新しいタブで開きます）"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#06C755] text-white text-sm font-bold rounded-xl hover:bg-[#05b04c] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                LINEでシェア
              </a>
              <button
                onClick={() => { setResult(null); setForm({ app: "Pairs", age: "", job: "", hobbies: "", profile: "", goals: [] }); }}
                aria-label="フォームをリセットしてもう一度添削する"
                className="flex items-center gap-2 bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                もう一度
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
