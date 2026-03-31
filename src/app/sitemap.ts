import { MetadataRoute } from "next";

const KEYWORD_SLUGS = [
  "konkatsu-profile-kakikata",
  "konkatsu-message-rei",
  "konkatsu-date-plan",
  "konkatsu-jiko-analysis",
  "matching-app-profile-photo",
  "konkatsu-age-saikounen",
  "pairs-profile-attrection",
  "kekkon-soudan-jyo-hiyo",
  "konkatsu-miai-junbi",
  "online-konkatsu-susume-kata",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://konkatsu-ai.vercel.app", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://konkatsu-ai.vercel.app/tool", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://konkatsu-ai.vercel.app/profile", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://konkatsu-ai.vercel.app/message", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://konkatsu-ai.vercel.app/analyze", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://konkatsu-ai.vercel.app/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://konkatsu-ai.vercel.app/legal", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: "https://konkatsu-ai.vercel.app/terms", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: "https://konkatsu-ai.vercel.app/privacy", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
  const keywordPages: MetadataRoute.Sitemap = KEYWORD_SLUGS.map((slug) => ({
    url: `https://konkatsu-ai.vercel.app/keywords/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...keywordPages];
}
