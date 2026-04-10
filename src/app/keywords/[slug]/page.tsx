import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossSell } from "@/components/CrossSell";

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  lastUpdated: string;
}

export const KEYWORDS: Record<string, KeywordData> = {
  "konkatsu-profile-kakikata": {
    title: "婚活 プロフィール 書き方｜マッチング率UPの例文をAIが自動生成",
    h1: "婚活 プロフィール 書き方",
    description: "婚活サイト・アプリのプロフィール文をAIが自動生成。マッチング率を上げる自己紹介・趣味・理想の相手の書き方を30秒で作成。",
    features: [
      { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "マッチング率UPの文章", text: "相手が「この人に会いたい」と感じる温かみ・共感・誠実さを伝えるプロフィール文をAIが生成します。" },
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "趣味・価値観を魅力的に", text: "「読書・料理・映画」でもAIが具体化・ストーリー化して魅力的な趣味欄に変換します。" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "サービス別に最適化", text: "マリッジ・ゼクシィ縁結び・Pairs・with など婚活サービス別に最適化したプロフィールを生成します。" },
    ],
    faqs: [
      { q: "婚活プロフィールで絶対に書いてはいけないことは何ですか？", a: "ネガティブな表現（元カレ/彼女の話・人間不信・条件が多すぎる）・過度な謙遜・コピペ感のある文章はマッチング率を下げます。婚活AIが自然で魅力的なプロフィールを生成します。" },
      { q: "婚活プロフィールの適切な文字数は？", a: "200〜500字が目安です。短すぎると熱意が伝わらず、長すぎると読まれません。婚活AIで適切な長さのプロフィールを生成できます。" },
      { q: "無料で何回使えますか？", a: "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "konkatsu-message-rei": {
    title: "婚活 メッセージ 例文｜最初の一言から返信率UPのAI生成",
    h1: "婚活 メッセージ 例文",
    description: "婚活アプリのメッセージ文をAIが自動生成。最初の挨拶文・話題の広げ方・デートへの誘い方まで30秒で例文を作成。返信率UP。",
    features: [
      { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "返信率を上げる最初のメッセージ", text: "相手のプロフィールを踏まえた共通点・質問を含む最初のメッセージを自動生成。既読無視を減らします。" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "会話を続ける話題展開", text: "話題が途切れた時・盛り上がった時にデートへ自然につなげるメッセージの流れをAIが提案します。" },
      { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "男女別に最適化", text: "男性からのアプローチメッセージ・女性からの返信メッセージ別に最適な文体を自動選択します。" },
    ],
    faqs: [
      { q: "婚活アプリで最初のメッセージは何を書けばいいですか？", a: "相手のプロフィールに触れた「共感・発見・質問」が効果的です。コピペ感のある定型文は避けましょう。婚活AIが相手のプロフィールを踏まえた自然な最初のメッセージを生成します。" },
      { q: "婚活アプリで返信が来ない場合はどうすればいいですか？", a: "メッセージの内容・プロフィールの写真・自己紹介文を見直すことが重要です。婚活AIでマッチング率を上げるプロフィール改善とメッセージ改善ができます。" },
      { q: "LINE交換するタイミングはいつがいいですか？", a: "3〜5回のやり取りで信頼関係ができてからが目安です。婚活AIでLINE交換へ自然につなげるメッセージを生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "konkatsu-date-plan": {
    title: "婚活 デート プラン 提案｜成功率UPのコースをAIが自動生成",
    h1: "婚活 デート プラン 提案",
    description: "婚活の初デートプランをAIが自動提案。「どこで何をするか」で迷わない成功率UPのデートコースを30秒で作成。東京・大阪対応。",
    features: [
      { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", title: "エリア・予算別に提案", text: "東京・大阪・名古屋など主要都市の相場に合ったデートスポット・コースを自動生成します。" },
      { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "初デート・2回目別に最適化", text: "初デートは「2〜3時間・昼間・公共の場所」が原則。2回目以降のステップアップも含めた計画を提案。" },
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "会話のネタも同時提案", text: "デートプランと合わせて「盛り上がる会話のネタ・NG話題・告白のタイミング」も提案します。" },
    ],
    faqs: [
      { q: "婚活の初デートでNGな場所はどこですか？", a: "映画館（会話できない）・カラオケ（距離感が近すぎる）・自宅・高級すぎるレストラン（プレッシャー）は初デートに不向きです。婚活AIで初デートに最適なコースを提案します。" },
      { q: "婚活デートの費用は割り勘ですか？", a: "初デートは男性がやや多め負担（6:4〜7:3）が多い傾向です。ただし価値観は多様化しています。婚活AIで双方が快適なプランを提案します。" },
      { q: "デートで何を話せばいいかわかりません", a: "趣味・休日の過ごし方・好きな食べ物・将来の夢など「共通点を探す会話」が効果的です。婚活AIで初デートで盛り上がる会話ネタも生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "konkatsu-jiko-analysis": {
    title: "婚活 自己分析 シート｜結婚相手に求める条件をAIが整理",
    h1: "婚活 自己分析 シート",
    description: "婚活の自己分析・結婚相手への条件整理をAIが支援。「自分は何を求めているか」を明確にする婚活シートを30秒で作成。",
    features: [
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "条件の優先順位整理", text: "「絶対条件・できれば条件・妥協できる条件」の3段階で結婚相手への条件を整理。婚活の方向性が明確になります。" },
      { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "自分の強み・弱みを分析", text: "「自分がパートナーに提供できるもの」と「改善すべき点」を分析し、婚活戦略を立てるサポートをします。" },
      { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "婚活疲れを防ぐ戦略", text: "闇雲に活動しない。自己分析に基づいたターゲット設定で婚活の効率と満足度を高めます。" },
    ],
    faqs: [
      { q: "婚活で条件を下げるべきですか？", a: "「絶対条件」（価値観・人格）は妥協せず、「あれば嬉しい条件」（身長・年収）は柔軟にすることが結婚につながりやすい戦略です。婚活AIで条件の優先順位を整理できます。" },
      { q: "婚活が長続きしないのはなぜですか？", a: "ターゲットが不明確・プロフィールが弱い・デートスキルが低いなどが原因として多いです。婚活AIで自己分析・プロフィール改善・デートサポートをまとめて支援します。" },
      { q: "婚活サービスは何を選べばいいですか？", a: "結婚相談所（成婚率高・費用高）・マッチングアプリ（費用安・自己管理）・婚活パーティーの3タイプがあります。婚活AIで自分に合ったサービス選びをサポートします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "matching-app-profile-photo": {
    title: "マッチングアプリ プロフィール 写真 選び方｜AIが改善点を提案",
    h1: "マッチングアプリ プロフィール 写真",
    description: "マッチングアプリのプロフィール写真の選び方・撮り方をAIが解説。マッチング率を上げる写真の特徴と改善ポイントを30秒で提案。",
    features: [
      { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", title: "マッチング率UP写真の条件", text: "「明るい場所・笑顔・清潔感・背景がきれい」がマッチング率を上げる写真の4条件です。AIが写真選びのポイントを解説。" },
      { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", title: "男女別の写真戦略", text: "男性は「誠実さ・清潔感・趣味が伝わる」、女性は「笑顔・明るさ・日常感」が重要。性別別の写真戦略を提案。" },
      { icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", title: "メイン・サブ写真の構成", text: "メイン（顔アップ）・サブ（全身・趣味・日常）の最適な写真構成をアドバイスします。" },
    ],
    faqs: [
      { q: "マッチングアプリの写真で避けるべきものは？", a: "サングラス・マスク（顔が見えない）・グループ写真（誰かわからない）・暗い・盛りすぎ加工は避けましょう。婚活AIで写真選びのチェックポイントを案内します。" },
      { q: "プロに写真撮影を頼むべきですか？", a: "マッチング率が3〜5倍向上するというデータもあります。婚活写真の専門カメラマン（2〜5万円）の利用も選択肢の一つです。費用対効果を考えると有効な投資です。" },
      { q: "写真を変えてもマッチング率が上がらない場合は？", a: "写真だけでなくプロフィール文・コメント・アプローチメッセージも見直しが必要です。婚活AIでプロフィール全体の改善をサポートします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "konkatsu-age-saikounen": {
    title: "婚活 年齢 最高年齢｜30代・40代からの婚活成功法をAIが提案",
    h1: "婚活 30代 40代 成功法",
    description: "30代・40代からの婚活成功法をAIが提案。年齢を強みに変えるプロフィール戦略・マッチングアプリの使い方を30秒で案内。",
    features: [
      { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "年齢を強みにする戦略", text: "30代・40代の「安定感・経験値・包容力」を強みとしてアピールするプロフィール戦略をAIが提案。" },
      { icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", title: "年代別婚活サービス選び", text: "30代・40代に向いている婚活サービス（結婚相談所・マッチングアプリ・婚活パーティー）の選び方を案内。" },
      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "スピード婚活の戦略", text: "年齢を意識した「スピードを重視する婚活戦略」と判断の基準を提示します。" },
    ],
    faqs: [
      { q: "30代・40代からでも婚活で結婚できますか？", a: "30代・40代での婚活成婚者は多く、結婚相談所の成婚者は30〜40代が主流です。年齢より「本気度・アプローチ力・プロフィールの質」が成功のカギです。婚活AIが戦略を提案します。" },
      { q: "30代・40代の婚活で使うべきサービスは？", a: "真剣度が高い相手が多い「結婚相談所・ゼクシィ縁結び・ユーブライド」が30〜40代に向いています。婚活AIで自分に合ったサービス選びをサポートします。" },
      { q: "婚活に使う費用の目安はいくらですか？", a: "マッチングアプリは月額3,000〜5,000円、結婚相談所は入会金10〜30万円+月会費3〜5万円が目安です。婚活AIで費用対効果の高い婚活戦略を提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "pairs-profile-attrection": {
    title: "Pairs プロフィール 魅力的 書き方｜AIがマッチング率UP",
    h1: "Pairs プロフィール 書き方",
    description: "Pairsのプロフィール文をAIが自動生成。「いいね！」が増えるコミュニティ活用・自己紹介文・趣味欄の書き方を30秒で作成。",
    features: [
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Pairs特化のプロフィール", text: "Pairsのコミュニティ機能・詳細プロフィール項目を最大活用した「いいね！」が集まるプロフィールを生成。" },
      { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "コミュニティ活用法", text: "Pairsのコミュニティ（趣味グループ）への参加・投稿でマッチング数を増やす戦略をAIが提案。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "マッチング後のメッセージ", text: "マッチング後の最初のメッセージ・会話継続・デート誘いまでの流れを婚活AIがサポートします。" },
    ],
    faqs: [
      { q: "PairsはOMiai・withと比べて何が違いますか？", a: "Pairsは会員数No.1・20〜30代が中心・コミュニティ機能が充実。OmiaiはPairsより真剣度高め・30代中心。withは性格診断機能が特徴・20代中心です。婚活AIで最適なサービスを提案します。" },
      { q: "Pairsのコミュニティはどう使えばいいですか？", a: "自分の趣味に関連するコミュニティに5〜10個参加し、積極的にいいね！・コメントすることでマッチング数が増加します。婚活AIでコミュニティ活用法を詳しく案内します。" },
      { q: "Pairsで有料プランにすべきですか？", a: "男性は月額3,590〜4,490円の有料プランで機能が充実（足跡・既読確認等）。真剣に婚活するなら有料プランが有効です。婚活AIでPairsの使い方を最適化します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kekkon-soudan-jyo-hiyo": {
    title: "結婚相談所 費用 比較｜コスパ良いサービスをAIが提案",
    h1: "結婚相談所 費用 比較",
    description: "結婚相談所の費用・料金・コスパ比較をAIが解説。入会金・月会費・成婚料の相場と選び方のポイントを30秒でわかりやすく案内。",
    features: [
      { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "料金体系を一覧比較", text: "大手・中堅・格安結婚相談所の入会金・月会費・成婚料の相場をAIが整理。コスパの良い選び方を提案。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "自分に合う相談所タイプ", text: "完全オンライン型・対面カウンセリング重視型・AI活用型など多様なタイプの選び方を案内します。" },
      { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "成婚率・退会率の見方", text: "成婚率の定義・計算方法・見せ方のトリックを解説。公開されている数字の正しい読み方を案内します。" },
    ],
    faqs: [
      { q: "結婚相談所の総費用はいくらかかりますか？", a: "大手（IBJ・ツヴァイ等）は入会金10〜30万円+月会費3〜5万円+成婚料10〜30万円で総額50〜100万円程度です。格安相談所は10〜30万円で完結するプランもあります。婚活AIで最適な選択を支援します。" },
      { q: "結婚相談所とマッチングアプリはどちらがいいですか？", a: "真剣度・費用・サポートの違いで選ぶのが重要です。自己管理に自信があればアプリ、サポートが欲しければ相談所が向いています。婚活AIで状況に合った提案をします。" },
      { q: "結婚相談所はどのくらいで成婚できますか？", a: "平均的な活動期間は1〜2年です。積極的に活動すれば6ヶ月〜1年での成婚事例も多くあります。婚活AIで活動を効率化するサポートをします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "konkatsu-miai-junbi": {
    title: "婚活 お見合い 準備｜初対面で好印象を与えるAIが支援",
    h1: "婚活 お見合い 準備",
    description: "婚活のお見合い当日の準備・服装・話題・マナーをAIが具体的に案内。初対面で好印象を与えるためのポイントを30秒でリスト化。",
    features: [
      { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "服装・身だしなみチェックリスト", text: "男女別の「好印象を与えるお見合い当日の服装・メイク・身だしなみ」チェックリストをAIが生成します。" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "会話ネタ・質問リスト", text: "お見合いで盛り上がる話題・NG話題・次につながる質問のリストをAIが生成します。" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "事後フォローの方法", text: "お見合い後のお礼メッセージ・仮交際申し込みのタイミング・断り方のマナーを案内します。" },
    ],
    faqs: [
      { q: "お見合いの場所はどこが多いですか？", a: "ホテルのロビーラウンジ・カフェが一般的です。会員制のお見合い施設を持つ結婚相談所もあります。婚活AIでお見合い準備のチェックリストを生成できます。" },
      { q: "お見合いで断られた場合はどうすればいいですか？", a: "相談所経由で丁寧に断ることがマナーです。断られた理由を分析し、次のお見合いに活かすことが大切です。婚活AIで断られた原因分析と改善策を提案します。" },
      { q: "お見合い当日に絶対やってはいけないことは？", a: "携帯を頻繁に見る・自分の話ばかりする・元彼/彼女の話・収入・家族の愚痴はNGです。婚活AIでお見合いのNGリストとベストプラクティスを案内します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "online-konkatsu-susume-kata": {
    title: "オンライン婚活 進め方｜マッチングから成婚までAIが完全サポート",
    h1: "オンライン婚活 進め方",
    description: "オンライン婚活の始め方から成婚までの進め方をAIが完全サポート。プロフィール作成・メッセージ・ビデオデートのコツを30秒で案内。",
    features: [
      { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "ビデオデートの成功法", text: "ZoomやLINEビデオ通話での婚活に特化した「背景・照明・服装・話し方・時間設定」のコツをAIが案内。" },
      { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "オンライン→リアル移行タイミング", text: "オンラインから初対面の実際のデートに移行する最適なタイミングと誘い方を提案します。" },
      { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "安全な出会いのチェック", text: "悪質業者・サクラの見分け方・個人情報保護の注意点など安全なオンライン婚活のポイントを案内。" },
    ],
    faqs: [
      { q: "オンライン婚活とリアル婚活はどちらが成婚率が高いですか？", a: "一概には言えませんが、オンラインは出会いの数が多く選択肢が広がる利点があります。コロナ以降オンライン婚活が普及し、成婚率も向上しています。婚活AIで最適な方法を提案します。" },
      { q: "マッチングアプリで会ったことがない相手と付き合えますか？", a: "会わずにアプリ内だけで「好き」になる感情は仮想的なものが多く、実際に会って確認することが重要です。婚活AIでビデオデート→実際の出会いへのステップを案内します。" },
      { q: "オンライン婚活の写真は加工してもいいですか？", a: "過度な加工は初対面時のギャップで信頼を失います。「自然な笑顔・清潔感・明るさ」がある写真が効果的です。婚活AIで写真選びのアドバイスをします。" },
    ],
    lastUpdated: "2026-03-31",
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

const SITE_URL = "https://konkatsu-ai.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kw = KEYWORDS[slug];
  if (!kw) return {};
  return {
    title: kw.title,
    description: kw.description,
    other: { "article:modified_time": kw.lastUpdated },
    openGraph: {
      title: kw.title,
      description: kw.description,
      url: `${SITE_URL}/keywords/${slug}`,
      siteName: "婚活AI｜プロフィール・メッセージ・デートプランをAIが自動生成",
      locale: "ja_JP",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: kw.h1 }],
    },
    twitter: { card: "summary_large_image", title: kw.title, description: kw.description, images: ["/og.png"] },
    alternates: { canonical: `${SITE_URL}/keywords/${slug}` },
  };
}

function FeatureIcon({ d }: { d: string }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-pink-500/10 border border-pink-500/20 shrink-0">
      <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </div>
  );
}

export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kw = KEYWORDS[slug];
  if (!kw) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "dateModified": kw.lastUpdated,
    mainEntity: kw.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(236,72,153,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.10) 0%, transparent 50%), #0B0F1E" }}>
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <p className="text-pink-400 text-sm font-medium tracking-wider mb-4">婚活AI｜プロフィール・メッセージ・デートプランを自動生成</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #FBCFE8, #FFFFFF, #E9D5FF)" }}>{kw.h1}</h1>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(251,207,232,0.8)" }}>{kw.description}</p>
          <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #EC4899, #A855F7)", boxShadow: "0 0 30px rgba(236,72,153,0.4)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            無料で婚活AIを使う
          </Link>
          <p className="text-xs mt-3" style={{ color: "rgba(251,207,232,0.5)" }}>登録不要・クレジットカード不要・無料3回</p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">特長</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {kw.features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                <FeatureIcon d={f.icon} />
                <h3 className="font-bold mt-4 mb-2 text-white/90">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(251,207,232,0.7)" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">よくある質問</h2>
          <div className="space-y-4">
            {kw.faqs.map((f, i) => (
              <details key={i} className="rounded-2xl border border-white/10 backdrop-blur-sm group" style={{ background: "rgba(255,255,255,0.03)" }}>
                <summary className="cursor-pointer px-6 py-4 font-medium text-white/90 flex items-center justify-between list-none">
                  {f.q}
                  <svg className="w-5 h-5 text-pink-400 transition-transform group-open:rotate-180 shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "rgba(251,207,232,0.7)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <div className="rounded-2xl p-8 border border-pink-500/20" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.05))" }}>
            <h2 className="text-xl font-bold mb-3 text-white/90">今すぐ婚活をAIでサポート</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(251,207,232,0.7)" }}>プロフィール・メッセージ・デートプランをAIが自動生成。婚活の悩みを解決します。</p>
            <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #EC4899, #A855F7)", boxShadow: "0 0 30px rgba(236,72,153,0.4)" }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              無料で婚活AIを使う
            </Link>
          </div>
        </section>

        <p className="text-center text-xs text-white/40 mt-8 pb-8">最終更新: 2026年3月31日</p>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <CrossSell currentService="婚活AI" />
        </section>
      </main>
    </>
  );
}
