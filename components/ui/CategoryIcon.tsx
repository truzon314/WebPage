import type { CategoryTile } from "@/types";

const PATHS: Record<CategoryTile["icon"], string[]> = {
  villa: ["M3 11l9-8 9 8", "M5 10v10h14V10", "M10 20v-6h4v6"],
  apartment: ["M4 3h16v18H4z", "M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"],
  plot: ["M2 20l6-11 4 6 3-5 7 10z"],
  commercial: ["M3 7h18v13H3z", "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  farm: ["M4 21c4-8 12-8 16-14", "M7,17 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0", "M17,9 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0"],
  indhouse: ["M4 11l8-7 8 7", "M6 10v10h12V10", "M10 20v-5h4v5"],
};

export function CategoryIcon({ icon, size = 30 }: { icon: CategoryTile["icon"]; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      {PATHS[icon].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
