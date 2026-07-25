import type { StaticImageData } from "next/image";

export type PropertyType =
  | "Villas"
  | "Apartments"
  | "Plots"
  | "Commercial"
  | "Farm Lands"
  | "Ind. Houses";

export type BudgetBracket = "under2" | "2to5" | "5to10" | "10plus";

export interface Property {
  id: string;
  name: string;
  city: string;
  location: string;
  /** Sourced from the CMS property's first assigned category — not a fixed union, since categories are editable in the CMS. */
  type: string;
  tagText: string;
  tagBg: string;
  tagColor: string;
  statusText: string;
  specA: string;
  specB: string;
  areaSqft: number;
  bedsOptions: string[] | null;
  price: string;
  budgetBracket: BudgetBracket;
  signature: boolean;
  image: string | StaticImageData;
}

export interface PropertyFilters {
  location: "all" | string;
  propertyType: "all" | string;
  budget: "all" | BudgetBracket;
  beds: "all" | string;
  area: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: NavLink[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: StaticImageData;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CategoryTile {
  label: string;
  href: string;
  icon: "villa" | "apartment" | "plot" | "commercial" | "farm" | "indhouse";
}

export interface StatEntry {
  value: string;
  label: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: "shield" | "handshake" | "location" | "award";
}

export interface ValueItem {
  title: string;
  description: string;
  icon: "integrity" | "craftsmanship" | "sustainability" | "clientFirst";
}

export interface Certification {
  label: string;
  icon: "dtcp" | "rera" | "igbc" | "iso";
}

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

export interface ContactCard {
  icon: "office" | "phone" | "email" | "clock";
  title: string;
  lines: string[];
}

export interface GetInTouchItem {
  icon: "calendar" | "search" | "lifebuoy";
  title: string;
  description: string;
  href: string;
}
