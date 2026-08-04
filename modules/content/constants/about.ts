import type { Certification, ValueItem } from "@/modules/content/types";

export const STORY_PARAGRAPHS: string[] = [
  "Truzon Homes was founded on a simple conviction: that a home should be as considered as it is comfortable. What began as a single residential project in Hyderabad has grown into a portfolio of 50+ villas, apartments, plots and gated communities across Hyderabad and Bangalore.",
  "Every Truzon development is DTCP-approved and RERA-registered from day one — because trust, to us, is a design requirement, not an afterthought. Today over 5,000 families call a Truzon address home.",
];

export const VALUES: ValueItem[] = [
  {
    icon: "integrity",
    title: "Integrity First",
    description: "Fully transparent pricing and documentation, from booking to registration.",
  },
  {
    icon: "craftsmanship",
    title: "Craftsmanship",
    description: "Only vetted materials and contractors, with architectural review at every milestone.",
  },
  {
    icon: "sustainability",
    title: "Sustainability",
    description: "Renewable energy, water recycling and organic green cover across new communities.",
  },
  {
    icon: "clientFirst",
    title: "Client-First",
    description: "Consultants available 24/7 through handover — and long after, for resale and referrals.",
  },
];

export const IN_HOUSE_BUILD = {
  title: "Built by Truzon Homes, In-House",
  description:
    "We design and construct every project ourselves — PEB, GFRG, RCC, and MIVAN — matching the method to the structure, not the other way around.",
  ctaLabel: "OUR CONSTRUCTION METHODS",
  ctaHref: "/services",
};

export const CERTIFICATIONS: Certification[] = [
  { icon: "dtcp", label: "DTCP Approved" },
  { icon: "rera", label: "RERA Registered" },
  { icon: "igbc", label: "IGBC Green Certified" },
  { icon: "iso", label: "ISO 9001:2015" },
];
