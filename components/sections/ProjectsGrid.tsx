"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

const FILTERS = ["All", "Villas", "Apartments", "Plots", "Commercial", "Farm Lands", "Ind. Houses"];

export function ProjectsGrid({ properties }: { properties: Property[] }) {
  const [active, setActive] = useState("All");

  const results = useMemo(
    () => (active === "All" ? properties : properties.filter((p) => p.type === active)),
    [active, properties]
  );

  return (
    <section className="py-16 lg:py-[90px]">
      <Container>
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={active === filter}
              className={cn(
                "rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer",
                active === filter
                  ? "bg-navy-900 text-white"
                  : "border border-border bg-surface text-text-strong hover:border-navy-800 hover:text-navy-900"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <p className="mb-6 text-center text-sm text-text-muted">
          {results.length} {results.length === 1 ? "property" : "properties"} found
        </p>

        {results.length === 0 ? (
          <div className="rounded-xl bg-surface-subtle p-16 text-center text-[15px] text-text-body">
            No properties in this category yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
