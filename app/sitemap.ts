import type { MetadataRoute } from "next";
import { getSettings, getSitemapEntries } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const origin = (settings.default_canonical_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const entries = await getSitemapEntries();
  return entries.map((entry) => ({ url: `${origin}${entry.path}`, lastModified: entry.last_modified ? new Date(entry.last_modified) : undefined, changeFrequency: entry.path.startsWith("/blog/") ? "monthly" : "weekly", priority: entry.path === "/" ? 1 : 0.7 }));
}
