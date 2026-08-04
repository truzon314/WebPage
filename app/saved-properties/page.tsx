import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { SavedPropertiesGrid } from "@/modules/properties/SavedPropertiesGrid";
import { listProperties } from "@/modules/properties/api";
import { toProperty } from "@/modules/properties/mappers";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Your saved property listings.",
};

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
