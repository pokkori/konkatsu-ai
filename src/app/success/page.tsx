"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number; shape: string }[]>([]);

  useEffect(() => {
    const colors = ["#f43f5e", "#ec4899", "#f59e0b", "#a855f7", "#06b6d4", "#FFD700"];
    const shapes = ["circle", "square", "heart"];
    const ps = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "heart" ? "50% 50% 0 0" : "2px",
            clipPath: p.shape === "heart" ? undefined : undefined,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          50% { opacity: 0.9; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

/* Inline SVG: Heart icon */
function HeartSvg() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="heart-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#fce7f3" />
      <path d="M32 50C24 44 14 36 14 26c0-6 4-10 9-10 3 0 6 2 9 6 3-4 6-6 9-6 5 0 9 4 9 10 0 10-10 18-18 24z" fill="url(#heart-grad)" />
    </svg>
  );
}

/* Inline SVG: Checkmark */
function CheckSvg() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mx-auto mb-2" aria-hidden="true">
      <defs>
        <linearGradient id="check-success" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#check-success)" opacity="0.15" />
      <circle cx="24" cy="24" r="16" fill="url(#check-success)" />
      <path d="M16 24l5 5 9-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 30%, #fef3c7 70%, #fff1f2 100%)" }}>
      {showConfetti && <Confetti />}
      <div className="rounded-3xl shadow-lg p-10 max-w-md w-full text-center" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(244,63,94,0.15)" }}>
        <div className="mb-4">
          <CheckSvg />
        </div>
        <div className="mb-6 flex justify-center" aria-hidden="true">
          <HeartSvg />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent mb-3">ご購入ありがとうございます!</h1>
        <p className="text-gray-500 mb-8">
          決済が完了しました。<br />
          婚活AIを全力活用して、素敵な出会いを見つけましょう!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            aria-label="プロフィール添削ツールを使う"
            className="py-3 rounded-xl font-bold transition-all min-h-[44px] flex items-center justify-center text-white shadow-lg shadow-pink-200/50 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #ec4899, #ef4444)" }}
          >
            プロフィール添削を使う
          </Link>
          <Link
            href="/message"
            aria-label="メッセージ文案生成ツールを使う"
            className="text-pink-600 border-2 border-pink-300 py-3 rounded-xl font-medium hover:bg-pink-50 transition-colors min-h-[44px] flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}
          >
            メッセージ生成を使う
          </Link>
        </div>
      </div>
    </div>
  );
}
