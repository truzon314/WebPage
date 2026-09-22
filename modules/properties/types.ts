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

export interface MasterPlanData {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface FloorPlanItem {
  name: string;
  config?: string;
  area?: string;
  price?: string;
  imageUrl?: string | null;
}

export interface VideoExperienceItem {
  title: string;
  category: string;
  videoUrl: string;
  posterImageUrl?: string | null;
}

export interface LocationLandmarkItem {
  name: string;
  category: string;
  distance: string;
}

export interface HighlightItem {
  label: string;
  value: string;
}

export interface OfferItem {
  title: string;
  description?: string;
  validUntil?: string;
  desktopCreativeUrl?: string | null;
}

export interface ConstructionUpdateItem {
  date: string;
  stage: string;
  progress: string;
  imageUrls?: string[];
}

export interface DetailedProperty extends Property {
  description: string;
  gallery: (string | StaticImageData)[];
  amenities: PropertyAmenity[];
  phone: string;
  mapProjectId: string | null;
  brochureUrl: string | null;

  // Cinematic & Conversion Fields
  heroMediaType?: "video" | "image" | "carousel";
  desktopHeroVideoUrl?: string | null;
  mobileHeroVideoUrl?: string | null;
  desktopHeroImageUrl?: string | null;
  mobileHeroImageUrl?: string | null;
  posterImageUrl?: string | null;
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroOverlayStrength?: number;
  heroTextAlign?: "left" | "center" | "right";
  heroTheme?: "dark" | "light";

  masterPlan?: MasterPlanData | null;
  floorPlans?: FloorPlanItem[];
  locationLandmarks?: LocationLandmarkItem[];
  videoExperience?: VideoExperienceItem[];
  highlights?: HighlightItem[];
  offers?: OfferItem[];
  constructionUpdates?: ConstructionUpdateItem[];

  reraNumber?: string | null;
  approvalInfo?: string | null;
  disclaimerText?: string | null;
  possessionDate?: string | null;
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
