import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return <ComingSoon title="Resident Testimonials" description="The full collection of resident stories is coming soon — see a preview on the homepage." />;
}
