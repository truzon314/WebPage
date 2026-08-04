"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/modules/properties/PropertyCard";
import { usePropertySearch } from "@/modules/properties/PropertySearchContext";

export function SignatureCollections() {
  const { results, resultLabel, searchActive } = usePropertySearch();

  return (
    <section id="collections" className="pb-24 pt-12 lg:pt-[150px]">
      <Container>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <h2 className="inline-block border-b-[3px] border-gold-400 pb-3 font-heading text-[28px] font-bold text-navy-900 sm:text-[34px]">
            {resultLabel}
          </h2>
          <Link href="/projects" className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl bg-surface-subtle p-16 text-center text-[15px] text-text-body">
            No properties match those filters yet — try widening your search, or{" "}
            <Link href="/contact" className="font-semibold text-gold-400">
              talk to our team
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {searchActive && results.length > 0 && results.length < 3 ? (
          <p className="mt-6 text-sm text-text-muted">
            Showing every project that matches your filters right now — check back soon as we add more.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
