import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/support",
    fallbackTitle: "Support & Help Desk",
    fallbackDescription: "Customer support and help desk for Truzon Homes home buyers.",
    noIndex: true,
  });
}

export default function SupportPage() {
  return <ComingSoon title="Support" description="Help with an existing order or booking is coming soon." />;
}
