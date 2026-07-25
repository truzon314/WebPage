"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Property, PropertyFilters } from "@/types";

const DEFAULT_FILTERS: PropertyFilters = {
  location: "all",
  propertyType: "all",
  budget: "all",
  beds: "all",
  area: "",
};

interface PropertySearchContextValue {
  draft: PropertyFilters;
  setDraftField: (field: keyof PropertyFilters, value: string) => void;
  runSearch: () => void;
  searchActive: boolean;
  results: Property[];
  resultLabel: string;
}

const PropertySearchContext = createContext<PropertySearchContextValue | null>(null);

function matchesFilters(property: Property, filters: PropertyFilters) {
  if (filters.location !== "all" && property.city !== filters.location) return false;
  if (filters.propertyType !== "all" && property.type !== filters.propertyType) return false;
  if (filters.budget !== "all" && property.budgetBracket !== filters.budget) return false;
  if (filters.beds !== "all" && !(property.bedsOptions ?? []).includes(filters.beds)) return false;
  if (filters.area) {
    const minArea = parseFloat(filters.area);
    if (!Number.isNaN(minArea) && property.areaSqft < minArea) return false;
  }
  return true;
}

/**
 * Shared filter state for the hero search bar and the Signature Collections
 * grid below it — in the original bundle these lived in one component; here
 * they're two independent, reusable components connected by context instead
 * of prop-drilling through Hero.
 */
export function PropertySearchProvider({
  properties,
  children,
}: {
  properties: Property[];
  children: ReactNode;
}) {
  const [draft, setDraft] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [searchActive, setSearchActive] = useState(false);

  const setDraftField = (field: keyof PropertyFilters, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const runSearch = () => {
    setFilters(draft);
    setSearchActive(true);
  };

  const results = useMemo(
    () =>
      searchActive ? properties.filter((p) => matchesFilters(p, filters)) : properties.filter((p) => p.signature),
    [searchActive, filters, properties]
  );

  const resultLabel = searchActive
    ? `${results.length} ${results.length === 1 ? "Match" : "Matches"} Found`
    : "Signature Collections";

  const value: PropertySearchContextValue = { draft, setDraftField, runSearch, searchActive, results, resultLabel };

  return <PropertySearchContext.Provider value={value}>{children}</PropertySearchContext.Provider>;
}

export function usePropertySearch() {
  const ctx = useContext(PropertySearchContext);
  if (!ctx) throw new Error("usePropertySearch must be used within a PropertySearchProvider");
  return ctx;
}
