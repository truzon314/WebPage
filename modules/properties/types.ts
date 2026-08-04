import type { StaticImageData } from "next/image";

export type PropertyType =
  | "Villas"
  | "Apartments"
  | "Plots"
  | "Commercial"
  | "Farm Lands"
  | "Ind. Houses";

export type BudgetBracket = "under2" | "2to5" | "5to10" | "10plus";

export interface PropertyAmenity {
  name: string;
  image?: string | StaticImageData;
}

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

export interface DetailedProperty extends Property {
  description: string;
  gallery: (string | StaticImageData)[];
  amenities: PropertyAmenity[];
  phone: string;
  mapProjectId: string | null;
  brochureUrl: string | null;
}

export interface PropertyFilters {
  location: "all" | string;
  propertyType: "all" | string;
  budget: "all" | BudgetBracket;
  beds: "all" | string;
  area: string;
}

export interface CategoryTile {
  label: string;
  href: string;
  icon: "villa" | "apartment" | "plot" | "commercial" | "farm" | "indhouse";
}
