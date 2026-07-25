"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Check, MapPin, Ruler } from "lucide-react";
import { useCompare } from "@/lib/context/CompareContext";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(property.id);

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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(property.id);
            }}
            aria-pressed={selected}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 py-1.5 pl-2 pr-3 text-[11px] font-semibold text-navy-900 shadow-sm cursor-pointer"
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px] transition-colors",
                selected ? "border-gold-400 bg-gold-400" : "border-text-faint bg-transparent"
              )}
            >
              {selected ? <Check size={11} strokeWidth={3} className="text-navy-900" /> : null}
            </span>
            Compare
          </button>
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
