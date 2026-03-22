import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://konkatsu-ai.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/profile`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/message`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/analyze`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
