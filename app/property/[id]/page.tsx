import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyDetailView } from "@/modules/properties/PropertyDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProperty } from "@/modules/properties/api";
import { getSettings } from "@/modules/content/api";
import { buildMetadata, propertyJsonLd } from "@/lib/seo";
import { getDetailedProperty } from "@/modules/properties/property-details";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cmsProperty = await getProperty(id).catch(() => null);
  if (!cmsProperty) return { title: "Property Not Found" };
  const property = getDetailedProperty(id, cmsProperty);

  return buildMetadata({
    seo: cmsProperty.seo,
    path: `/property/${id}`,
    fallbackTitle: property.name,
    fallbackDescription: property.location || property.description,
    fallbackImage: cmsProperty.featured_image_url,
  });
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cmsProperty, settings] = await Promise.all([
    getProperty(id).catch(() => null),
    getSettings().catch(() => null),
  ]);
  if (!cmsProperty) notFound();

  const property = getDetailedProperty(id, cmsProperty, settings?.callback_phone);

  return (
    <>
      <JsonLd data={cmsProperty.seo?.schema_jsonld || propertyJsonLd(cmsProperty, SITE_URL)} />
      <PropertyDetailView property={property} />
    </>
  );
}
