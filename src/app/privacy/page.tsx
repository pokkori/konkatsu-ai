import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-pink-100 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-pink-600">婚活AI</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12 text-sm text-gray-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
        <section><h2 className="font-bold text-base mb-2">1. 収集する情報</h2><ul className="list-disc list-inside space-y-1 text-gray-600"><li>決済時にStripe社が収集する支払情報（当社はカード番号を保持しません）</li><li>ブラウザのCookieおよびlocalStorage（利用回数の管理）</li><li>アクセスログ（IPアドレス・ブラウザ種別・閲覧ページ）</li></ul></section>
        <section><h2 className="font-bold text-base mb-2">2. 利用目的</h2><ul className="list-disc list-inside space-y-1 text-gray-600"><li>サービスの提供・運営・改善</li><li>お問い合わせへの回答</li><li>不正利用の検知と防止</li></ul></section>
        <section><h2 className="font-bold text-base mb-2">3. 第三者提供</h2><p>法令に基づく場合および決済処理のためStripe, Inc.に提供する場合を除き、第三者への提供は行いません。</p></section>
        <section><h2 className="font-bold text-base mb-2">4. Cookieの使用</h2><p>無料利用回数の管理のためにCookieを使用しています。</p></section>
        <section><h2 className="font-bold text-base mb-2">5. お問い合わせ</h2><p>support@example.com</p></section>
        <p className="text-gray-400 text-xs pt-4 border-t">制定日：2025年1月1日</p>
      </div>
    </div>
  );
}
