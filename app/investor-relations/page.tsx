import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Investor Relations" };

export default function InvestorRelationsPage() {
  return <ComingSoon title="Investor Relations" description="Financial disclosures and investor updates are coming soon." />;
}
