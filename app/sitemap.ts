import type { MetadataRoute } from "next";
import worksData from "@/content/works.json";
import type { Work } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const updated = new Date("2026-09-04");
  return [
    { url: base, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/works`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resources/legal-glossary`, lastModified: updated, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guestbook`, lastModified: updated, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    ...(worksData as Work[]).map((work) => ({ url: `${base}/works/${work.slug}`, lastModified: new Date(work.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
