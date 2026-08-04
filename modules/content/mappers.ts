import type { CmsMenuItem } from "@/modules/content/api";
import type { FooterLinkColumn, NavLink } from "@/types";

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
