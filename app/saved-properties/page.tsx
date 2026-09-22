import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { SavedPropertiesGrid } from "@/modules/properties/SavedPropertiesGrid";
import { listProperties } from "@/modules/properties/api";
import { toProperty } from "@/modules/properties/mappers";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/saved-properties",
    fallbackTitle: "Saved Properties",
    fallbackDescription: "Your saved property listings on Truzon Homes.",
    noIndex: true,
  });
}

export default async function SavedPropertiesPage() {
  const { items } = await listProperties().catch(() => ({ items: [], total: 0 }));
  const properties = items.map(toProperty);

  return (
    <>
      <PageHero
        title="Saved Properties"
        subtitle="Listings you've saved for later."
        crumbs={[{ label: "Home", href: "/" }, { label: "Saved Properties" }]}
      />
      <SavedPropertiesGrid properties={properties} />
    </>
  );
}
