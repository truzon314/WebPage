import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsOfServicePage() {
  return <ComingSoon title="Terms of Service" description="Our full terms of service are coming soon." />;
}
