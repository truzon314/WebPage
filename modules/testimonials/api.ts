import { cmsFetch } from "@/lib/cms-client";

export interface CmsTestimonial {
  id: string;
  name: string;
  role_or_location: string | null;
  quote: string;
  photo_url: string | null;
  rating: number | null;
}

export async function listTestimonials(params: { featuredOnly?: boolean } = {}): Promise<CmsTestimonial[]> {
  const search = new URLSearchParams();
  if (params.featuredOnly) search.set("featured_only", "true");
  const { data } = await cmsFetch<CmsTestimonial[]>(`/public/testimonials?${search.toString()}`);
  return data ?? [];
}
