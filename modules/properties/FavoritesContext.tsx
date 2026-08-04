"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface FavoritesContextValue {
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  favoriteIds: string[];
}

const FAVORITES_KEY = "favorite_properties";

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Site-wide "favorite properties" selection, available from any PropertyCard
 * (Home's Signature Collections, the Projects grid, PropertyDetailView's own
 * heart button) — persisted to localStorage so a returning visitor's
 * favorites survive a reload, same pattern as PropertyDetailView.tsx's
 * `map_unlock_granted` flag. Backs the /saved-properties page.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {
      // Corrupted localStorage value — ignore, start empty.
    }
  }, []);

  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      }
      return next;
    });
  };

  const value: FavoritesContextValue = {
    isFavorite: (id) => favorites.has(id),
    toggle,
    favoriteIds: [...favorites],
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
