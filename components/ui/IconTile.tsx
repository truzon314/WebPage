"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { CategoryTile } from "@/types";

export function IconTile({ label, href, icon }: CategoryTile) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(18,23,43,0.12)" }}
      transition={{ duration: 0.2 }}
      className="rounded-[10px] bg-surface shadow-[0_2px_10px_rgba(18,23,43,0.05)]"
    >
      <Link href={href} className="flex flex-col items-center gap-3.5 px-4 py-8 text-center text-navy-900">
        <span className="text-gold-400">
          <CategoryIcon icon={icon} />
        </span>
        <span className="text-xs font-bold tracking-[0.5px]">{label.toUpperCase()}</span>
      </Link>
    </motion.div>
  );
}
