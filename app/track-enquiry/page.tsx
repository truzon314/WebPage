import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/track-enquiry",
    fallbackTitle: "Track Enquiry Status",
    fallbackDescription: "Track the progress and status of your submitted property enquiry.",
    noIndex: true,
  });
}

export default function TrackEnquiryPage() {
  return <ComingSoon title="Track Your Enquiry" description="Enquiry status tracking is coming soon." />;
}
