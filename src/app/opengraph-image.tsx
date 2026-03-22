import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "婚活AI - AIがあなたの恋愛を全力サポート";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fecdd3 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ec4899, #f43f5e)",
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(236,72,153,0.4)",
          }}
        >
          <span style={{ fontSize: 56, color: "white", fontWeight: 900 }}>AI</span>
        </div>
        {/* タイトル */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#be185d",
            marginBottom: 16,
            letterSpacing: "-2px",
          }}
        >
          婚活AI
        </div>
        {/* サブタイトル */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#6b7280",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          AIがあなたの恋愛を全力サポート
        </div>
        {/* 3機能タグ */}
        <div style={{ display: "flex", gap: 16 }}>
          {["プロフィール添削", "メッセージ生成", "返信分析"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "white",
                color: "#db2777",
                fontSize: 22,
                fontWeight: 700,
                padding: "10px 24px",
                borderRadius: 999,
                border: "2px solid #fbcfe8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {/* 登録不要ラベル */}
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            color: "#9ca3af",
          }}
        >
          登録不要・無料で今すぐ試せる
        </div>
      </div>
    ),
    { ...size }
  );
}
