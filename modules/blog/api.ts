import { cmsFetch } from "@/lib/cms-client";
import type { CmsSeo } from "@/modules/content/api";
import type { CmsCategory } from "@/modules/properties/api";

export interface CmsBlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string;
  category_names: string[];
  reading_time_minutes: number | null;
  is_featured: boolean;
  published_at: string | null;
}

export interface CmsBlogPost extends Omit<CmsBlogPostListItem, "category_names"> {
  body: string | null;
  categories: CmsCategory[];
  tags: CmsCategory[];
  seo: CmsSeo | null;
}

export async function listBlogPosts(
  params: { page?: number; per_page?: number } = {}
): Promise<{ items: CmsBlogPostListItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  search.set("per_page", String(params.per_page ?? 50));

  const { data, meta } = await cmsFetch<CmsBlogPostListItem[]>(`/public/blog?${search}`);
  return { items: data ?? [], total: meta?.total ?? 0 };
}

export async function getBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const { data } = await cmsFetch<CmsBlogPost>(`/public/blog/${slug}`);
  return data;
}
