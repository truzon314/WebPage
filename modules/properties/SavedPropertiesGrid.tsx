"use client";

import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/modules/properties/PropertyCard";
import { useFavorites } from "@/modules/properties/FavoritesContext";
import type { Property } from "@/modules/properties/types";

export function SavedPropertiesGrid({ properties }: { properties: Property[] }) {
  const { favoriteIds } = useFavorites();
  const saved = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <section className="py-16 lg:py-[90px]">
      <Container>
        {saved.length === 0 ? (
          <div className="rounded-xl bg-surface-subtle p-16 text-center text-[15px] text-text-body">
            You haven&apos;t saved any properties yet — tap the heart on a listing to save it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
