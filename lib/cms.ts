/**
 * Fetch client for truzon-cms's `/public/*` surface (API.md) — the only CMS
 * API my-app is allowed to call. Every response is the envelope
 * `{success, data, meta, error}`; `cache: "no-store"` on every request so
 * edits made in the CMS show up on the next page load, not after a rebuild.
 */

export const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:8000";

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: { page: number; per_page: number; total: number; total_pages: number } | null;
  error: { code: string; message: string; details?: unknown } | null;
}

async function cmsFetch<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${CMS_URL}${path}`, { ...init, cache: "no-store" });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok && res.status !== 404) {
    throw new Error(body.error?.message ?? `CMS request to ${path} failed (${res.status})`);
  }
  return body;
}

export interface CmsSeo {
  seo_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card_type: string | null;
  robots: string | null;
  schema_jsonld: Record<string, unknown> | null;
}

export interface CmsBlock {
  id: string;
  type: string;
  position: number;
  config: Record<string, any>;
}

export interface CmsPage {
  page_type: string;
  slug: string;
  title: string;
  seo: CmsSeo | null;
  blocks: CmsBlock[];
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
}

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

export interface CmsPropertyListItem {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  location_text: string | null;
  type: string | null;
  price_display: string | null;
  budget_bracket: string | null;
  spec_a: string | null;
  spec_b: string | null;
  beds_options: string[] | null;
  tag_text: string | null;
  status_text: string | null;
  is_signature: boolean;
  featured_image_url: string | null;
}

export interface CmsProperty extends CmsPropertyListItem {
  area_sqft: string | null;
  categories: CmsCategory[];
  gallery: string[];
  seo: CmsSeo | null;
}

export interface CmsMenuItem {
  label: string;
  href: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  children: CmsMenuItem[];
}

export interface CmsMenu {
  key: string;
  label: string;
  items: CmsMenuItem[];
}

export interface CmsSettings {
  site_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  callback_phone: string | null;
  whatsapp_number: string | null;
  contact_address: string | null;
  social_facebook_url: string | null;
  social_instagram_url: string | null;
  social_linkedin_url: string | null;
  social_youtube_url: string | null;
  analytics_ga_measurement_id: string | null;
}

export async function getPage(pageType: string): Promise<CmsPage | null> {
  const { data } = await cmsFetch<CmsPage>(`/public/pages/${pageType}`);
  return data;
}

export async function listProperties(
  params: { page?: number; per_page?: number; city?: string; signature?: boolean } = {}
): Promise<{ items: CmsPropertyListItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  search.set("per_page", String(params.per_page ?? 100));
  if (params.city) search.set("city", params.city);
  if (params.signature !== undefined) search.set("signature", String(params.signature));

  const { data, meta } = await cmsFetch<CmsPropertyListItem[]>(`/public/properties?${search}`);
  return { items: data ?? [], total: meta?.total ?? 0 };
}

export async function getProperty(slug: string): Promise<CmsProperty | null> {
  const { data } = await cmsFetch<CmsProperty>(`/public/properties/${slug}`);
  return data;
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

export async function getMenu(key: string): Promise<CmsMenu | null> {
  const { data } = await cmsFetch<CmsMenu>(`/public/menus/${key}`);
  return data;
}

export async function getSettings(): Promise<CmsSettings> {
  const { data } = await cmsFetch<CmsSettings>("/public/settings");
  return (
    data ?? {
      site_name: null,
      logo_url: null,
      favicon_url: null,
      contact_email: null,
      contact_phone: null,
      callback_phone: null,
      whatsapp_number: null,
      contact_address: null,
      social_facebook_url: null,
      social_instagram_url: null,
      social_linkedin_url: null,
      social_youtube_url: null,
      analytics_ga_measurement_id: null,
    }
  );
}

export async function submitForm(
  formKey: string,
  payload: { name: string; phone?: string; email?: string; property_type_interest?: string; message?: string }
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${CMS_URL}/public/forms/${formKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json()) as ApiEnvelope<{ id: string; status: string }>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Could not submit the form — please try again.");
  }
  return body.data;
}
