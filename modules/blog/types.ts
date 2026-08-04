import type { StaticImageData } from "next/image";

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body?: string | null;
  image: string | StaticImageData;
  /** e.g. "6 min read" — shown on the Blog index page, not the Home preview cards. */
  readTime?: string;
}
