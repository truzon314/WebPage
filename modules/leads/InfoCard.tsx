"use client";

import { motion } from "framer-motion";
import { Building2, Clock, Mail, Phone, type LucideIcon } from "lucide-react";
import type { ContactCard } from "@/modules/leads/types";

const ICONS: Record<ContactCard["icon"], LucideIcon> = {
  office: Building2,
  phone: Phone,
  email: Mail,
  clock: Clock,
};

export function InfoCard({ title, lines, icon }: ContactCard) {
  const Icon = ICONS[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="rounded-[10px] bg-surface p-6 shadow-[0_2px_10px_rgba(18,23,43,0.05)]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-gold-400">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="mb-2 text-[14.5px] font-bold text-navy-900">{title}</div>
      <div className="flex flex-col gap-1">
        {lines.map((line) => (
          <p key={line} className="text-[13px] leading-[1.6] text-text-body">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
