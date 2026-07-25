import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Sitemap" };

export default function SitemapPage() {
  return <ComingSoon title="Sitemap" description="A full site directory is coming soon." />;
}
