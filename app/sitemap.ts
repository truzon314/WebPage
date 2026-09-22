import type { MetadataRoute } from "next";
import { getSettings, getSitemapEntries } from "@/modules/content/api";

export const dynamic = "force-dynamic";

const CORE_STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/projects", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.8, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faqs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.7, changeFrequency: "weekly" },
  { path: "/testimonials", priority: 0.7, changeFrequency: "monthly" },
  { path: "/investor-relations", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings().catch(() => null);
  const origin = (settings?.default_canonical_url || process.env.NEXT_PUBLIC_SITE_URL || "https://www.truzonhomes.com").replace(/\/$/, "");
  const entries = await getSitemapEntries().catch(() => []);

  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();

  // 1. Add core static routes
  for (const route of CORE_STATIC_ROUTES) {
    routeMap.set(route.path === "" ? "/" : route.path, {
      url: `${origin}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // 2. Add dynamic entries from CMS (properties, blog posts, etc.)
  if (entries && entries.length > 0) {
    for (const entry of entries) {
      const normalizedPath = entry.path === "" ? "/" : entry.path;
      if (!routeMap.has(normalizedPath)) {
        let priority = 0.7;
        let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly";

        if (normalizedPath.startsWith("/property/")) {
          priority = 0.85;
          changeFrequency = "daily";
        } else if (normalizedPath.startsWith("/blog/")) {
          priority = 0.75;
          changeFrequency = "monthly";
        }

        routeMap.set(normalizedPath, {
          url: `${origin}${entry.path}`,
          lastModified: entry.last_modified ? new Date(entry.last_modified) : new Date(),
          changeFrequency,
          priority,
        });
      }
    }
  }

  return Array.from(routeMap.values());
}

