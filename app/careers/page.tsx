import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return <ComingSoon title="Careers at Truzon Homes" description="Open roles and our hiring process will be posted here soon." />;
}
