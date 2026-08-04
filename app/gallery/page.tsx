import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { GalleryPage } from "@/modules/gallery/GalleryPage";
import { listGalleryItems } from "@/modules/gallery/api";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo tours of Truzon Homes' completed projects across Hyderabad and Bangalore.",
};

export default async function Page() {
  const items = await listGalleryItems().catch(() => []);

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="A closer look at our completed projects and communities."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <GalleryPage items={items} />
    </>
  );
}
