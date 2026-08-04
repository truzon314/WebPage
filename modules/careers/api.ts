import { cmsFetch } from "@/lib/cms-client";

export interface CmsCareer {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string;
  apply_email: string | null;
}

export async function listCareers(): Promise<CmsCareer[]> {
  const { data } = await cmsFetch<CmsCareer[]>("/public/careers");
  return data ?? [];
}
