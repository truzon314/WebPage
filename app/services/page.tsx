import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <ComingSoon title="Services" description="Details on our design, construction, and interior services are coming soon." />;
}
