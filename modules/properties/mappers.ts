import type { CmsProperty, CmsPropertyListItem } from "@/modules/properties/api";
import type { BudgetBracket, Property } from "@/modules/properties/types";

/**
 * Property's `image` field is typed `string | StaticImageData` precisely so
 * CMS-sourced URL strings pass straight into `next/image` without any JSX changes
 * in PropertyCard/PropertyGrid/etc.
 */
const FALLBACK_IMAGE = "/images/placeholders/proj-azure.png";

// Property model has no color columns (ERD.md) — tag color is cosmetic only,
// so it's derived here from the known tag_text values rather than adding a
// schema migration for it. Unrecognized/new tag_text values (added later via
// the CMS) fall back to the navy default instead of breaking the card.
const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  EXCLUSIVE: { bg: "#4c7d2e", color: "#ffffff" },
  "UNDER CONSTRUCTION": { bg: "#16264d", color: "#ffffff" },
  "LIMITED PLOTS": { bg: "#d4a537", color: "#12172b" },
  "NEW LAUNCH": { bg: "#4c7d2e", color: "#ffffff" },
  "FAST SELLING": { bg: "#d4a537", color: "#12172b" },
  "DTCP APPROVED": { bg: "#16264d", color: "#ffffff" },
};
const DEFAULT_TAG_STYLE = { bg: "#16264d", color: "#ffffff" };

function tagStyle(tagText: string | null) {
  return (tagText && TAG_STYLES[tagText]) || DEFAULT_TAG_STYLE;
}

export function toProperty(p: CmsPropertyListItem | CmsProperty): Property {
  const style = tagStyle(p.tag_text);
  return {
    id: p.slug,
    name: p.name,
    city: p.city ?? "",
    location: p.location_text ?? "",
    type: p.type ?? "",
    tagText: p.tag_text ?? "",
    tagBg: style.bg,
    tagColor: style.color,
    statusText: p.status_text ?? "",
    specA: p.spec_a ?? "",
    specB: p.spec_b ?? "",
    areaSqft: "area_sqft" in p && p.area_sqft ? Number(p.area_sqft) : 0,
    bedsOptions: p.beds_options,
    price: p.price_display ?? "",
    budgetBracket: (p.budget_bracket ?? "under2") as BudgetBracket,
    signature: p.is_signature,
    image: p.featured_image_url ?? FALLBACK_IMAGE,
  };
}
