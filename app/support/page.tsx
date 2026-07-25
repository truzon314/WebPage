import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return <ComingSoon title="Support" description="Help with an existing order or booking is coming soon." />;
}
