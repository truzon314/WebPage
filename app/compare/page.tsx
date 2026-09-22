import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/compare",
    fallbackTitle: "Compare Properties",
    fallbackDescription: "Compare real estate projects and properties side by side.",
    noIndex: true,
  });
}

export default function ComparePage() {
  return <ComingSoon title="Compare Properties" description="Side-by-side project comparisons are coming soon." />;
}
