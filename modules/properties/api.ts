import { cmsFetch } from "@/lib/cms-client";
import type { CmsSeo } from "@/modules/content/api";

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
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

export interface CmsPropertyAmenity {
  name: string;
  image_url: string | null;
}

export interface CmsProperty extends CmsPropertyListItem {
  area_sqft: string | null;
  description: string | null;
  amenities: CmsPropertyAmenity[];
  categories: CmsCategory[];
  gallery: string[];
  seo: CmsSeo | null;
  map_project_id: string | null;
  brochure_url: string | null;
}

export interface CmsMapLayer {
  id: string;
  label: string;
  stroke_color: string;
  fill_color: string;
  fill_opacity: number;
  stroke_weight: number;
  default_visible: boolean;
  color_rules: { id: string; property: string; value: string; action: "color" | "hide"; color?: string; opacity?: number }[] | null;
  label_property: string | null;
  popup_enabled: boolean;
  popup_properties: string[] | null;
  stroke_style: "solid" | "dashed" | "dotted";
}

export interface CmsMapProject {
  project: { id: string; name: string; map_provider_type: string };
  layers: CmsMapLayer[];
}

export async function listCategories(appliesTo?: "blog" | "property"): Promise<CmsCategory[]> {
  const search = appliesTo ? `?applies_to=${appliesTo}` : "";
  const { data } = await cmsFetch<CmsCategory[]>(`/public/categories${search}`);
  return data ?? [];
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

export async function getMapProject(projectId: string): Promise<CmsMapProject | null> {
  const { data } = await cmsFetch<CmsMapProject>(`/public/mapping/project/${projectId}`);
  return data;
}

export async function getMapLayerGeoJson(
  projectId: string,
  layerId: string
): Promise<import("geojson").FeatureCollection | null> {
  const { data } = await cmsFetch<import("geojson").FeatureCollection>(
    `/public/mapping/project/${projectId}/layers/${layerId}`
  );
  return data;
}
