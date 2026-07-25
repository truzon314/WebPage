import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "My Account" };

export default function MyAccountPage() {
  return <ComingSoon title="My Account" description="Account management is coming soon." />;
}
