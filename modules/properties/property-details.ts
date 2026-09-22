import { resolveMediaUrl } from "@/lib/cms-client";
import type { StaticImageData } from "next/image";
import { PROPERTIES } from "@/modules/properties/constants/properties";
import type { CmsProperty } from "@/modules/properties/api";
import { toProperty } from "@/modules/properties/mappers";
import type { DetailedProperty, PropertyAmenity } from "@/modules/properties/types";

import projAzure from "@/public/images/placeholders/proj-azure.png";
import projElysian from "@/public/images/placeholders/proj-elysian.png";
import projGrand from "@/public/images/placeholders/proj-grand.png";
import projRv from "@/public/images/placeholders/proj-rv.png";
import projSneha from "@/public/images/placeholders/proj-sneha.png";
import projRainbow from "@/public/images/placeholders/proj-rainbow.png";
import projHeaven from "@/public/images/placeholders/proj-heaven.png";
import heroPhoto3 from "@/public/images/placeholders/hero-photo-3.png";
import heroPhoto4 from "@/public/images/placeholders/hero-photo-4.png";
import aboutStory from "@/public/images/placeholders/about-story-photo.png";
import whyChoose from "@/public/images/placeholders/why-choose-photo.png";

const DEFAULT_PHONE = "+91 90000 12345";

const AMENITIES_CATALOG: Record<string, PropertyAmenity[]> = {
  "azure-heights": [
    { name: "Rooftop infinity pool", image: projAzure },
    { name: "Private elevator lobby", image: projElysian },
    { name: "Smart home automation", image: heroPhoto3 },
    { name: "Concierge & valet", image: aboutStory },
    { name: "Fitness studio & spa", image: whyChoose },
    { name: "EV charging", image: heroPhoto4 },
  ],
  "heaven-city": [
    { name: "DTCP & RERA Approved Layout", image: projHeaven },
    { name: "100ft & 40ft Black Top Roads", image: projGrand },
    { name: "Underground Drainage & Utilities", image: projRv },
    { name: "Gated Community & 24/7 Security", image: heroPhoto3 },
    { name: "Landscaped Parks & Play Area", image: aboutStory },
    { name: "Electricity & Solar Lights", image: heroPhoto4 },
  ],
  "elysian-woods": [
    { name: "Private Villa Pools", image: projElysian },
    { name: "Gated Clubhouse & Lounge", image: projAzure },
    { name: "Smart Home Integration", image: heroPhoto3 },
    { name: "24/7 Valet & Concierge", image: aboutStory },
    { name: "Fitness Studio & Tennis", image: whyChoose },
    { name: "EV Charging Infrastructure", image: heroPhoto4 },
  ],
  "grand-estate": [
    { name: "DTCP & RERA Approved Plots", image: projGrand },
    { name: "Underground Cabling", image: projHeaven },
    { name: "Wide Internal Roads", image: projRv },
    { name: "24/7 Security Entry", image: heroPhoto3 },
    { name: "Avenue Plantation", image: aboutStory },
    { name: "Water Tank & Power Backup", image: heroPhoto4 },
  ],
  default: [
    { name: "Rooftop infinity pool", image: projAzure },
    { name: "Private elevator lobby", image: projElysian },
    { name: "Smart home automation", image: heroPhoto3 },
    { name: "Concierge & valet", image: aboutStory },
    { name: "Fitness studio & spa", image: whyChoose },
    { name: "EV charging", image: heroPhoto4 },
  ],
};

const DESCRIPTIONS: Record<string, string> = {
  "azure-heights":
    "Rising over Banjara Hills, The Azure Heights pairs full-height glazing with private plunge pools on select floors. Residences are finished with imported marble and app-controlled climate systems, set within a 24-hour concierge tower.",
  "heaven-city":
    "Heaven City is a premium DTCP & RERA approved mega residential layout situated strategically along the Mumbai Highway corridor in Ranjole, Zaheerabad. Built for luxury modern living and rapid capital appreciation, Heaven City features wide 100ft & 40ft black top roads, underground utilities, lush avenue plantation, landscaped parks, and 24/7 gated security.",
  "elysian-woods":
    "Nestled in the lush greenery of Whitefield, Elysian Woods offers ultra-luxury private villas with secluded gardens, private pools, soaring double-height ceilings,and state-of-the-art home automation.",
  "grand-estate":
    "The Grand Estate in Kokapet offers prime residential plots within an eco-conscious gated layout featuring underground cabling, wide internal roads, and immediate RERA/DTCP clearance.",
  "rv-green-park":
    "RV Green Park in Shankarpally is a serene farm land layout offering 1-acre open plots surrounded by nature, perfect for organic farming or Weekend villa retreats.",
  "sneha-villas":
    "Sneha Villas in Kompally combines architectural sophistication with family comfort, featuring spacious 3 BHK luxury villas with private terraces and community parks.",
  "rainbow-villas":
    "Rainbow Villas in Adibatla provides ready-to-move independent houses built to high quality standards near Hyderabad's major aerospace and IT hubs.",
};

const GALLERIES: Record<string, (string | StaticImageData)[]> = {
  "azure-heights": [projAzure, projElysian, heroPhoto3, heroPhoto4],
  "heaven-city": [projHeaven, projGrand, projRv, heroPhoto3],
  "elysian-woods": [projElysian, projAzure, aboutStory, whyChoose],
  "grand-estate": [projGrand, projHeaven, projRv, heroPhoto4],
  "rv-green-park": [projRv, projGrand, projHeaven, heroPhoto3],
  "sneha-villas": [projSneha, projAzure, heroPhoto4, aboutStory],
  "rainbow-villas": [projRainbow, projSneha, projGrand, whyChoose],
};

export function getDetailedProperty(
  idOrSlug: string,
  cmsProperty?: CmsProperty | null,
  phone?: string | null
): DetailedProperty | null {
  if (!cmsProperty) {
    const normalizedId = idOrSlug.toLowerCase().trim();
    const staticProp = PROPERTIES.find((p) => p.id.toLowerCase() === normalizedId);
    if (!staticProp) return null;

    return {
      ...staticProp,
      description: DESCRIPTIONS[normalizedId] || "",
      gallery: GALLERIES[normalizedId] || [staticProp.image],
      amenities: AMENITIES_CATALOG[normalizedId] || AMENITIES_CATALOG["default"],
      phone: phone || DEFAULT_PHONE,
      mapProjectId: null,
      brochureUrl: null,
    };
  }

  const baseProp = toProperty(cmsProperty);

  const gallery = (cmsProperty.gallery || [])
    .map((url) => resolveMediaUrl(url))
    .filter((url): url is string => Boolean(url));

  const amenities: PropertyAmenity[] = (cmsProperty.amenities || []).map((a) => ({
    name: a.name,
    image: resolveMediaUrl(a.image_url) ?? undefined,
  }));

  return {
    ...baseProp,
    description: cmsProperty.description || "",
    gallery: gallery.length > 0 ? gallery : [baseProp.image],
    amenities,
    phone: phone || DEFAULT_PHONE,
    mapProjectId: cmsProperty.map_project_id ?? null,
    brochureUrl: resolveMediaUrl(cmsProperty.brochure_url) ?? null,

    heroMediaType: cmsProperty.hero_media_type ?? "image",
    desktopHeroVideoUrl: cmsProperty.desktop_hero_video_url ? resolveMediaUrl(cmsProperty.desktop_hero_video_url) : null,
    mobileHeroVideoUrl: cmsProperty.mobile_hero_video_url ? resolveMediaUrl(cmsProperty.mobile_hero_video_url) : null,
    desktopHeroImageUrl: cmsProperty.desktop_hero_image_url ? resolveMediaUrl(cmsProperty.desktop_hero_image_url) : null,
    mobileHeroImageUrl: cmsProperty.mobile_hero_image_url ? resolveMediaUrl(cmsProperty.mobile_hero_image_url) : null,
    posterImageUrl: cmsProperty.poster_image_url ? resolveMediaUrl(cmsProperty.poster_image_url) : null,
    heroHeading: cmsProperty.hero_heading ?? cmsProperty.name,
    heroSubheading: cmsProperty.hero_subheading ?? cmsProperty.location_text ?? null,
    heroOverlayStrength: cmsProperty.hero_overlay_strength ?? 40,
    heroTextAlign: cmsProperty.hero_text_align ?? "left",
    heroTheme: cmsProperty.hero_theme ?? "dark",

    masterPlan: cmsProperty.master_plan
      ? {
          title: cmsProperty.master_plan.title || "Master Layout Plan",
          description: cmsProperty.master_plan.description,
          imageUrl: cmsProperty.master_plan.image_url ? resolveMediaUrl(cmsProperty.master_plan.image_url) : null,
        }
      : null,
    floorPlans: (cmsProperty.floor_plans || []).map((f) => ({
      name: f.name || "Floor Plan",
      config: f.config,
      area: f.area,
      price: f.price,
      imageUrl: f.image_url ? resolveMediaUrl(f.image_url) : null,
    })),
    locationLandmarks: (cmsProperty.location_landmarks || []).map((l) => ({
      name: l.name,
      category: l.category || "General",
      distance: l.distance || "5 Mins",
    })),
    videoExperience: (cmsProperty.video_experience || []).map((v) => ({
      title: v.title || "Project Video",
      category: v.category || "Walkthrough",
      videoUrl: v.video_url || "",
      posterImageUrl: v.poster_image_url ? resolveMediaUrl(v.poster_image_url) : null,
    })),
    highlights: cmsProperty.highlights || [],
    offers: (cmsProperty.offers || []).map((o) => ({
      title: o.title,
      description: o.description,
      validUntil: o.valid_until,
      desktopCreativeUrl: o.desktop_creative_url ? resolveMediaUrl(o.desktop_creative_url) : null,
    })),
    constructionUpdates: (cmsProperty.construction_updates || []).map((c) => ({
      date: c.date,
      stage: c.stage,
      progress: c.progress,
      imageUrls: (c.image_urls || []).map((url: string) => resolveMediaUrl(url)).filter(Boolean),
    })),
    reraNumber: cmsProperty.rera_number ?? null,
    approvalInfo: cmsProperty.approval_info ?? "DTCP & RERA Approved",
    disclaimerText: cmsProperty.disclaimer_text ?? null,
    possessionDate: cmsProperty.possession_date ?? null,
  };
}