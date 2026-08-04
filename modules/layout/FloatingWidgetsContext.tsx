"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface FloatingWidgetsContextValue {
  mapInView: boolean;
  setMapInView: (value: boolean) => void;
}

const FloatingWidgetsContext = createContext<FloatingWidgetsContextValue | null>(null);

/** Lets a page's own map section (rendered deep inside `children`) tell the
 * site-wide floating WhatsApp/chat widgets (mounted once in the root layout)
 * to get out of the way while that map is on screen — a Leaflet map's own
 * zoom controls sit in the same bottom-right corner these widgets float in. */
export function FloatingWidgetsProvider({ children }: { children: ReactNode }) {
  const [mapInView, setMapInView] = useState(false);
  return (
    <FloatingWidgetsContext.Provider value={{ mapInView, setMapInView }}>{children}</FloatingWidgetsContext.Provider>
  );
}

export function useFloatingWidgets(): FloatingWidgetsContextValue {
  const ctx = useContext(FloatingWidgetsContext);
  if (!ctx) throw new Error("useFloatingWidgets must be used within a FloatingWidgetsProvider");
  return ctx;
}
