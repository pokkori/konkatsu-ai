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
          background: "linear-gradient(135deg, #7f1d1d 0%, #be185d 40%, #9d174d 70%, #4c0519 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 装飾: 背景円 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* ゴールドトップバー */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)",
          }}
        />

        {/* グラスモーフィズム背景カード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.20)",
            borderRadius: 32,
            padding: "48px 64px",
            gap: 0,
          }}
        >
          {/* ロゴバッジ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              marginBottom: 24,
              boxShadow: "0 8px 32px rgba(251,191,36,0.5)",
            }}
          >
            <span style={{ fontSize: 44, color: "#7f1d1d", fontWeight: 900 }}>AI</span>
          </div>

          {/* タイトル */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: 12,
              letterSpacing: "-2px",
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            婚活AI
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 36,
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            AIがあなたの恋愛を全力サポート
          </div>

          {/* 3機能タグ */}
          <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
            {["プロフィール添削", "メッセージ生成", "返信分析"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "10px 22px",
                  borderRadius: 999,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.5px",
          }}
        >
          konkatsu-ai.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
