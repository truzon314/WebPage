import type { Metadata } from "next";
import { SitemapGate } from "@/modules/content/SitemapGate";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/sitemap",
    fallbackTitle: "HTML Sitemap & Navigation",
    fallbackDescription: "Full index of projects, communities, resources, and company pages for Truzon Homes.",
  });
}

export default function SitemapPage() {
  return <SitemapGate />;
}
