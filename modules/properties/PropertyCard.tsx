"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Heart, MapPin, Ruler, Share2 } from "lucide-react";
import { useFavorites } from "@/modules/properties/FavoritesContext";
import { cn } from "@/lib/utils";
import type { Property } from "@/modules/properties/types";

export function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(property.id);
  const [linkCopied, setLinkCopied] = useState(false);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/property/${property.id}`;
    // Prefer the OS/browser's native share sheet (WhatsApp, Messages,
    // Email, etc.) when available; only fall back to a plain clipboard
    // copy on desktop browsers that don't support the Web Share API.
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.name,
          text: `${property.name} — ${property.location} — ${property.price}`,
          url,
        });
      } catch {
        // User dismissed the share sheet or it failed silently — nothing
        // to recover from here, this is expected/common behavior.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      // Clipboard access blocked — no further fallback available.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[10px] bg-surface shadow-[0_2px_18px_rgba(18,23,43,0.08)]"
    >
      <Link href={`/property/${property.id}`} className="block text-inherit">
        <div className="relative h-[210px] w-full">
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
          <span
            className="absolute left-3.5 top-3.5 rounded-[3px] px-3 py-1.5 text-[10.5px] font-bold tracking-[0.4px]"
            style={{ background: property.tagBg, color: property.tagColor }}
          >
            {property.tagText}
          </span>
          <span className="absolute right-3.5 top-3.5 rounded-[3px] bg-white px-3 py-1.5 text-[10.5px] font-bold text-navy-900">
            {property.statusText}
          </span>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this property"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm cursor-pointer"
            >
              <Share2 size={16} className="text-navy-900" />
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
              aria-label={favorited ? "Remove from saved properties" : "Save property"}
              aria-pressed={favorited}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm cursor-pointer"
            >
              <Heart size={17} className={cn(favorited ? "fill-red-600 text-red-600" : "text-navy-900")} />
            </button>
          </div>
        </div>

        <div className="px-[22px] pb-6 pt-5">
          <div className="mb-1.5 font-heading text-[19px] font-bold text-navy-900">{property.name}</div>
          <div className="mb-3.5 flex items-center gap-1.5 text-[13px] text-text-muted">
            <MapPin size={13} strokeWidth={2} />
            {property.location}
          </div>
          <div className="mb-4 flex gap-4 border-b border-divider pb-4 text-[12.5px] text-text-strong">
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} strokeWidth={2} />
              {property.specA}
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler size={13} strokeWidth={2} />
              {property.specB}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-heading text-[19px] font-bold text-navy-900">{property.price}</span>
            <span className="rounded-[5px] border-[1.5px] border-navy-800 px-[18px] py-[9px] text-xs font-semibold text-navy-800">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
