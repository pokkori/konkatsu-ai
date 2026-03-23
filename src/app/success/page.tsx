"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-10 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="#fce7f3" />
            <path d="M20 32 C20 24 28 18 32 18 C36 18 44 24 44 32 C44 40 36 46 32 50 C28 46 20 40 20 32Z" fill="#f43f5e" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">ご購入ありがとうございます！</h1>
        <p className="text-gray-500 mb-8">
          決済が完了しました。<br />
          婚活AIを全力活用して、素敵な出会いを見つけましょう！
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            aria-label="プロフィール添削ツールを使う"
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all"
          >
            プロフィール添削を使う
          </Link>
          <Link
            href="/message"
            aria-label="メッセージ文案生成ツールを使う"
            className="bg-white text-pink-600 border-2 border-pink-300 py-3 rounded-xl font-medium hover:bg-pink-50 transition-colors"
          >
            メッセージ生成を使う
          </Link>
        </div>
      </div>
    </div>
  );
}
