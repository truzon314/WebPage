import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return <ComingSoon title="Account Login" description="Buyer account sign-in is coming soon." />;
}
