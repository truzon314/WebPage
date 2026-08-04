import type { Metadata } from "next";
import { SitemapGate } from "@/modules/content/SitemapGate";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Share your details to view our full project listings.",
};

export default function SitemapPage() {
  return <SitemapGate />;
}
