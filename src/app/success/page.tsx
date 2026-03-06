"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch(`/api/stripe/verify?session_id=${sessionId}`);
    }
  }, [params]);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-10 max-w-md w-full text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">ご購入ありがとうございます！</h1>
      <p className="text-gray-500 mb-8">
        決済が完了しました。<br />
        婚活AIを全力活用して、素敵な出会いを見つけましょう！
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/profile"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all"
        >
          プロフィール添削を使う
        </Link>
        <Link
          href="/message"
          className="bg-white text-pink-600 border-2 border-pink-300 py-3 rounded-xl font-medium hover:bg-pink-50 transition-colors"
        >
          メッセージ生成を使う
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-400">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
