import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-pink-100 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-pink-600">婚活AI</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">利用規約</h1>
        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第1条（適用）</h2>
            <p>本規約は、ポッコリラボ（以下「当社」）が提供する婚活AIサービス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、本サービスを利用するものとします。</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第2条（利用登録）</h2>
            <p>本サービスの利用を希望する方は、本規約に同意した上で利用登録を行うものとします。当社は、利用登録申請者に以下の事由があると判断した場合、利用登録を拒否することがあります。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、当社が利用登録を相当でないと判断した場合</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第3条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社のサービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第4条（免責事項）</h2>
            <p>当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。</p>
            <p className="mt-2">本サービスが提供するAIアドバイスはあくまで参考情報であり、婚活の結果を保証するものではありません。</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第5条（サービス内容の変更等）</h2>
            <p>当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第6条（利用規約の変更）</h2>
            <p>当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
              <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 mb-2">第7条（準拠法・裁判管轄）</h2>
            <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>
          </section>
          <p className="text-gray-400 text-xs mt-8">制定日：2025年1月1日</p>
        </div>
      </main>
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-pink-100">
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/legal" className="hover:text-pink-500 transition-colors">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-pink-500 transition-colors">プライバシーポリシー</Link>
        </div>
        <p>© 2025 婚活AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
