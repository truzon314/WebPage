import type { CmsBlogPost, CmsBlogPostListItem, CmsMenuItem, CmsProperty, CmsPropertyListItem } from "@/lib/cms";
import type { BlogPost, BudgetBracket, FooterLinkColumn, NavLink, Property } from "@/types";

/**
 * Property/BlogPost's `image` field is typed `string | StaticImageData` precisely so
 * CMS-sourced URL strings pass straight into `next/image` without any JSX changes
 * in PropertyCard/PropertyGrid/BlogGrid/etc.
 */
const FALLBACK_IMAGE = "/images/placeholders/proj-azure.png";

// Property model has no color columns (ERD.md) — tag color is cosmetic only,
// so it's derived here from the known tag_text values rather than adding a
// schema migration for it. Unrecognized/new tag_text values (added later via
// the CMS) fall back to the navy default instead of breaking the card.
const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  EXCLUSIVE: { bg: "#5f9c3a", color: "#ffffff" },
  "UNDER CONSTRUCTION": { bg: "#16264d", color: "#ffffff" },
  "LIMITED PLOTS": { bg: "#d4a537", color: "#12172b" },
  "NEW LAUNCH": { bg: "#5f9c3a", color: "#ffffff" },
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

function formatReadTime(minutes: number | null): string | undefined {
  return typeof minutes === "number" ? `${minutes} min read` : undefined;
}

export function toBlogPost(post: CmsBlogPostListItem | CmsBlogPost): BlogPost {
  const category = "category_names" in post ? post.category_names[0] : post.categories[0]?.name;
  return {
    slug: post.slug,
    category: category ?? "",
    title: post.title,
    excerpt: post.excerpt ?? "",
    body: "body" in post ? post.body : undefined,
    image: post.featured_image_url ?? FALLBACK_IMAGE,
    readTime: formatReadTime(post.reading_time_minutes),
  };
}

export function toNavLinks(items: CmsMenuItem[]): NavLink[] {
  return items.map((item) => ({ label: item.label, href: item.href }));
}

export function toFooterColumn(title: string, items: CmsMenuItem[]): FooterLinkColumn {
  return { title, links: toNavLinks(items) };
}

/** `tel:` links need digits (and a leading +) only — lets the CMS store a
 * human-typed display string like "+91 90000 12345" without a second field. */
export function toTelHref(display: string | null | undefined): string | undefined {
  if (!display) return undefined;
  const digits = display.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

/** WhatsApp settings field stores digits-with-country-code only (e.g.
 * "919000012345") — my-app builds the wa.me URL so the CMS field doesn't
 * need to look like a URL. */
export function toWhatsAppHref(digits: string | null | undefined): string | undefined {
  if (!digits) return undefined;
  const clean = digits.replace(/[^\d]/g, "");
  return clean ? `https://wa.me/${clean}` : undefined;
}
