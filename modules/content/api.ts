import { cmsFetch } from "@/lib/cms-client";

export interface CmsSeo {
  seo_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card_type: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_url: string | null;
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
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_keywords: string[] | null;
  default_canonical_url: string | null;
  organization_name: string | null;
  google_verification_code: string | null;
  bing_verification_code: string | null;
  google_tag_manager_id: string | null;
  meta_pixel_id: string | null;
  google_search_console_verification: string | null;
  og_default_image_url: string | null;
  twitter_card_default_type: string | null;
  working_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  service_areas: string[] | null;
  why_choose_image_url: string | null;
  contact_map_image_url: string | null;
}

export interface CmsSitemapEntry {
  path: string;
  last_modified: string | null;
}

export async function getPage(pageType: string): Promise<CmsPage | null> {
  const { data } = await cmsFetch<CmsPage>(`/public/pages/${pageType}`);
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
      default_meta_title: null, default_meta_description: null, default_keywords: null, default_canonical_url: null,
      organization_name: null, google_verification_code: null, bing_verification_code: null, google_tag_manager_id: null,
      meta_pixel_id: null, google_search_console_verification: null, og_default_image_url: null,
      twitter_card_default_type: null, working_hours: null, latitude: null, longitude: null, service_areas: null,
      why_choose_image_url: null, contact_map_image_url: null,
    }
  );
}

export async function getSitemapEntries(): Promise<CmsSitemapEntry[]> {
  const { data } = await cmsFetch<CmsSitemapEntry[]>("/public/sitemap");
  return data ?? [];
}
