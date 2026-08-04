"use client";

import { motion } from "framer-motion";
import { Hammer, HeartHandshake, Leaf, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ValueItem } from "@/modules/content/types";

const ICONS: Record<ValueItem["icon"], LucideIcon> = {
  integrity: ShieldCheck,
  craftsmanship: Hammer,
  sustainability: Leaf,
  clientFirst: HeartHandshake,
};

export function ValueCard({ title, description, icon }: ValueItem) {
  const Icon = ICONS[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35 }}
      className="rounded-[10px] bg-surface p-7 shadow-[0_2px_10px_rgba(18,23,43,0.05)]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-gold-400">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="mb-2 text-[15px] font-bold text-navy-900">{title}</div>
      <p className="text-[13.5px] leading-[1.6] text-text-body">{description}</p>
    </motion.div>
  );
}
