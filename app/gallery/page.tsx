import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <ComingSoon title="Gallery" description="Photo and video tours of our completed projects are coming soon." />;
}
