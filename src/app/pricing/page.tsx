import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">料金プランページ</h1>
        <p className="text-gray-500 mb-6">こちらのページで料金プランをご確認いただけます。</p>
        <Link
          href="/#pricing"
          aria-label="トップページの料金プランセクションを見る"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all"
        >
          料金プランを見る
        </Link>
      </div>
    </div>
  );
}
