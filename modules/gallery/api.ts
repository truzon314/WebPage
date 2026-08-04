import { cmsFetch } from "@/lib/cms-client";

export interface CmsGalleryItem {
  id: string;
  image_url: string | null;
  caption: string | null;
  category: string | null;
}

export async function listGalleryItems(params: { category?: string } = {}): Promise<CmsGalleryItem[]> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  const { data } = await cmsFetch<CmsGalleryItem[]>(`/public/gallery?${search.toString()}`);
  return data ?? [];
}
