import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqsPage() {
  return <ComingSoon title="Frequently Asked Questions" description="A full FAQ library is coming soon — see common questions on the homepage in the meantime." />;
}
