"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Heart, MapPin, MessageSquare, Grid, List, Ruler, Share2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useFavorites } from "@/modules/properties/FavoritesContext";
import { cn } from "@/lib/utils";
import type { Property } from "@/modules/properties/types";

const FALLBACK_TYPES = ["Villas", "Apartments", "Plots", "Commercial", "Farm Lands", "Ind. Houses"];
const TYPE_DISPLAY_ORDER = ["Villas", "Plots"];

function sortTypesForDisplay(types: string[]): string[] {
  const known = TYPE_DISPLAY_ORDER.filter((t) => types.includes(t));
  const rest = types.filter((t) => !TYPE_DISPLAY_ORDER.includes(t));
  return [...known, ...rest];
}

export function ProjectsGrid({ properties, types }: { properties: Property[]; types?: string[] }) {
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const typeFilters = ["All", ...sortTypesForDisplay(types && types.length > 0 ? types : FALLBACK_TYPES)];
  const statusFilters = ["All", "Ready to Move", "Under Construction", "New Launch"];

  const results = useMemo(() => {
    return properties.filter((p) => {
      if (activeType !== "All" && p.type !== activeType) return false;
      if (activeStatus !== "All") {
        const s = (p.statusText || "").toLowerCase();
        if (activeStatus === "Ready to Move" && !s.includes("ready")) return false;
        if (activeStatus === "Under Construction" && !s.includes("construction")) return false;
        if (activeStatus === "New Launch" && !s.includes("new")) return false;
      }
      return true;
    });
  }, [activeType, activeStatus, properties]);

  return (
    <section className="py-12 lg:py-20 bg-surface-subtle/50">
      <Container>
        {/* Discovery Filter Controls */}
        <div className="mb-10 flex flex-col gap-5 rounded-2xl border border-divider bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mr-1">Type:</span>
            {typeFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveType(filter)}
                aria-pressed={activeType === filter}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
                  activeType === filter
                    ? "bg-navy-900 text-white shadow-sm"
                    : "bg-surface-subtle text-text-strong hover:bg-neutral-200"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="rounded-lg border border-divider bg-surface px-3 py-2 text-xs font-medium text-text-strong cursor-pointer focus:outline-none focus:ring-1 focus:ring-navy-900"
            >
              {statusFilters.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Statuses" : st}
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-lg border border-divider p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={cn(
                  "p-1.5 rounded cursor-pointer transition-colors",
                  viewMode === "grid" ? "bg-navy-900 text-white" : "text-text-muted hover:text-navy-900"
                )}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={cn(
                  "p-1.5 rounded cursor-pointer transition-colors",
                  viewMode === "list" ? "bg-navy-900 text-white" : "text-text-muted hover:text-navy-900"
                )}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-text-muted font-medium">
          Showing <span className="font-bold text-navy-900">{results.length}</span> {results.length === 1 ? "project" : "projects"}
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-divider bg-white p-16 text-center text-sm text-text-muted">
            No projects match your current filters — try selecting different parameters.
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-7",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            {results.map((property) => (
              <ProjectCard key={property.id} property={property} layout={viewMode} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function ProjectCard({ property, layout = "grid" }: { property: Property; layout?: "grid" | "list" }) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(property.id);
  const [linkCopied, setLinkCopied] = useState(false);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/projects/${property.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.name,
          text: `${property.name} — ${property.location} — ${property.price}`,
          url,
        });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {}
  }

  const whatsappMessage = encodeURIComponent(`Hi Truzon Homes, I am interested in ${property.name} (${property.location}). Please share details.`);
  const whatsappUrl = `https://wa.me/919000012345?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group overflow-hidden rounded-2xl bg-white border border-divider/60 shadow-[0_4px_24px_rgba(18,23,43,0.06)] hover:shadow-[0_12px_36px_rgba(18,23,43,0.12)] transition-all",
        layout === "list" ? "flex flex-col md:flex-row" : ""
      )}
    >
      <Link
        href={`/projects/${property.id}`}
        className={cn("block text-inherit relative", layout === "list" ? "md:w-2/5 shrink-0" : "")}
      >
        <div className={cn("relative w-full overflow-hidden", layout === "list" ? "h-64 md:h-full" : "h-[240px]")}>
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {property.tagText && (
              <span
                className="rounded-md px-3 py-1 text-[11px] font-bold tracking-wide shadow-sm"
                style={{ background: property.tagBg, color: property.tagColor }}
              >
                {property.tagText}
              </span>
            )}
            {property.statusText && (
              <span className="rounded-md bg-white/95 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-navy-900 shadow-sm">
                {property.statusText}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share project"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
            >
              <Share2 size={15} className="text-navy-900" />
              {linkCopied && (
                <span className="absolute -top-9 right-0 whitespace-nowrap rounded-md bg-navy-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
                  Link copied!
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggle(property.id);
              }}
              aria-label={favorited ? "Remove from saved" : "Save project"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
            >
              <Heart size={16} className={cn(favorited ? "fill-red-600 text-red-600" : "text-navy-900")} />
            </button>
          </div>
        </div>
      </Link>

      <div className={cn("p-6 flex flex-col justify-between flex-1", layout === "list" ? "md:p-8" : "")}>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">{property.type}</div>
          <Link href={`/projects/${property.id}`}>
            <h3 className="mb-2 font-heading text-xl font-bold text-navy-900 group-hover:text-amber-700 transition-colors">
              {property.name}
            </h3>
          </Link>
          <div className="mb-4 flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <MapPin size={14} className="text-amber-600 shrink-0" />
            {property.location}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-surface-subtle/80 p-3 text-xs text-text-strong">
            {property.specA && (
              <span className="flex items-center gap-1.5 font-medium">
                <BedDouble size={14} className="text-navy-800" />
                {property.specA}
              </span>
            )}
            {property.specB && (
              <span className="flex items-center gap-1.5 font-medium">
                <Ruler size={14} className="text-navy-800" />
                {property.specB}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-divider pt-4 mt-2">
          <div>
            <span className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Starting From</span>
            <span className="font-heading text-lg font-bold text-navy-900">{property.price || "Contact for Price"}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={17} />
            </a>
            <Link
              href={`/projects/${property.id}`}
              className="rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
            >
              Explore Project
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
