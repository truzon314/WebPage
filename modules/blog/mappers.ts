import type { CmsBlogPost, CmsBlogPostListItem } from "@/modules/blog/api";
import type { BlogPost } from "@/modules/blog/types";
import { resolveMediaUrl } from "@/lib/cms-client";

const FALLBACK_IMAGE = "/images/placeholders/proj-azure.png";

function formatReadTime(minutes: number | null): string | undefined {
  return typeof minutes === "number" ? `${minutes} min read` : undefined;
}

export function toBlogPost(post: CmsBlogPostListItem | CmsBlogPost): BlogPost {
  const category = "category_names" in post ? post.category_names[0] : post.categories[0]?.name;
  return {
    slug: post.slug,
    category: category ?? "",
    title: post.title,
    excerpt: post.excerpt ?? "",
    body: "body" in post ? post.body : undefined,
    image: resolveMediaUrl(post.featured_image_url) ?? FALLBACK_IMAGE,
    readTime: formatReadTime(post.reading_time_minutes),
  };
}
