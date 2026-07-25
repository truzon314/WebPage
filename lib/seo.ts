import type { Metadata } from "next";
import type { CmsBlogPost, CmsProperty, CmsSeo, CmsSettings } from "@/lib/cms";

const TWITTER_CARD_TYPES = new Set(["summary", "summary_large_image", "player", "app"]);

function asTwitterCard(value: string | null | undefined): "summary" | "summary_large_image" {
  return value && TWITTER_CARD_TYPES.has(value) ? (value as "summary" | "summary_large_image") : "summary";
}

interface BuildMetadataOptions {
  seo?: CmsSeo | null;
  settings?: CmsSettings | null;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
}

/** Merges a CMS entity's SeoMeta over site-wide Global SEO Settings over a hardcoded fallback. */
export function buildMetadata({ seo, settings, path, fallbackTitle, fallbackDescription }: BuildMetadataOptions): Metadata {
  const title = seo?.seo_title || settings?.default_meta_title || fallbackTitle;
  const description = seo?.meta_description || settings?.default_meta_description || fallbackDescription;
  const keywords = seo?.keywords ?? settings?.default_keywords ?? undefined;
  const canonical =
    seo?.canonical_url ||
    (settings?.default_canonical_url ? `${settings.default_canonical_url.replace(/\/$/, "")}${path}` : undefined);
  const ogImage = seo?.og_image_url || settings?.og_default_image_url || undefined;
  const twitterImage = seo?.twitter_image_url || ogImage;

  return {
    title,
    description,
    keywords: keywords ?? undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.robots ?? undefined,
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: asTwitterCard(seo?.twitter_card_type || settings?.twitter_card_default_type),
      title: seo?.twitter_title || title,
      description: seo?.twitter_description || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export function organizationJsonLd(settings: CmsSettings, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.organization_name || settings.site_name || "Truzon Homes",
    url: siteUrl,
    ...(settings.logo_url ? { logo: settings.logo_url } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: settings.contact_phone || "",
        contactType: "customer service",
        email: settings.contact_email || "",
      },
    ],
    sameAs: [
      settings.social_facebook_url,
      settings.social_instagram_url,
      settings.social_linkedin_url,
      settings.social_youtube_url,
    ].filter((url): url is string => Boolean(url)),
  };
}

export function localBusinessJsonLd(settings: CmsSettings, siteUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    name: settings.organization_name || settings.site_name || "Truzon Homes",
    url: siteUrl,
    telephone: settings.contact_phone || "",
    email: settings.contact_email || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contact_address || "",
      addressCountry: "IN",
    },
  };
  if (settings.logo_url) schema.image = settings.logo_url;
  if (settings.latitude != null && settings.longitude != null) {
    schema.geo = { "@type": "GeoCoordinates", latitude: settings.latitude, longitude: settings.longitude };
  }
  if (settings.working_hours) schema.openingHours = settings.working_hours;
  if (settings.service_areas && settings.service_areas.length > 0) schema.areaServed = settings.service_areas;
  return schema;
}

export function websiteJsonLd(settings: CmsSettings, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name || "Truzon Homes",
    url: siteUrl,
  };
}

export function articleJsonLd(post: CmsBlogPost, siteUrl: string) {
  const title = post.seo?.seo_title || post.title;
  const description = post.seo?.meta_description || post.excerpt || "";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: { "@type": "Person", name: post.author_name || "Truzon Editorial Team" },
    ...(post.featured_image_url ? { image: post.featured_image_url } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
  };
}

export function propertyJsonLd(property: CmsProperty, siteUrl: string) {
  const title = property.seo?.seo_title || property.name;
  const description = property.seo?.meta_description || "";
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "RealEstateListing"],
    name: title,
    description,
    category: "Real Estate",
    ...(property.featured_image_url ? { image: property.featured_image_url } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: property.price_display || "Contact for Price",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/property/${property.slug}`,
    },
  };
}
