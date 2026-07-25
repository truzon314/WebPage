"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CompareContextValue {
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

/**
 * Site-wide "compare properties" selection, available from any PropertyCard
 * (Home's Signature Collections, the Projects grid, etc). Kept in memory
 * only — wire up to the /compare page once that page has a real design.
 */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const value: CompareContextValue = {
    isSelected: (id) => selected.has(id),
    toggle,
    count: selected.size,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
