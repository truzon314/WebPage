"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, ChevronDown, LifeBuoy, Search, type LucideIcon } from "lucide-react";
import { GET_IN_TOUCH_ITEMS } from "@/lib/constants/contact";
import { cn } from "@/lib/utils";
import type { GetInTouchItem } from "@/types";

const ICONS: Record<GetInTouchItem["icon"], LucideIcon> = {
  calendar: CalendarClock,
  search: Search,
  lifebuoy: LifeBuoy,
};

/** Header CTA that drops down to the site's core "get in touch" actions. */
export function GetInTouchMenu({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 rounded-[4px] bg-gold-400 px-5 py-3 text-[13px] font-bold tracking-[0.3px] text-navy-900 transition-colors hover:bg-gold-500 cursor-pointer",
          scrolled ? "" : "shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
        )}
      >
        GET IN TOUCH
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} strokeWidth={2.4} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-lg border border-divider bg-surface p-2 shadow-[0_20px_50px_rgba(10,18,36,0.2)]"
          >
            {GET_IN_TOUCH_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <Link
                  key={item.title}
                  role="menuitem"
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-surface-muted"
                >
                  <Icon size={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{item.title}</span>
                    <span className="block text-xs text-text-muted">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
