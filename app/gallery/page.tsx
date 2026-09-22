import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { GalleryPage } from "@/modules/gallery/GalleryPage";
import { listGalleryItems } from "@/modules/gallery/api";
import { getPage, getSettings } from "@/modules/content/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata(): Promise<Metadata> {
  const [galleryPage, settings] = await Promise.all([
    getPage("gallery").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: galleryPage?.seo,
    settings,
    path: "/gallery",
    fallbackTitle: "Project Gallery & Image Tours",
    fallbackDescription:
      "Explore photo tours of completed villas, gated layouts, and modern residential developments by Truzon Homes across Hyderabad and Bangalore.",
  });
}

export default async function Page() {
  const items = await listGalleryItems().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "Gallery", url: "/gallery" },
          ],
          SITE_URL
        )}
      />
      <PageHero
        title="Gallery"
        subtitle="A closer look at our completed projects and communities."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <GalleryPage items={items} />
    </>
  );
}
