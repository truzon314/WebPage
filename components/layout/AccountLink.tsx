"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reconstructed placeholder for the original site's `AccountLink` widget
 * import (not included in the Home page bundle). Mirrors its footprint next
 * to Login: a lightweight saved-properties shortcut.
 */
export function AccountLink({ scrolled }: { scrolled: boolean }) {
  return (
    <Link
      href="/saved-properties"
      aria-label="Saved properties"
      className={cn(
        "flex items-center gap-1.5 text-[13px] font-medium transition-colors",
        scrolled ? "text-navy-900 hover:text-gold-500" : "text-white hover:text-gold-200"
      )}
    >
      <Heart size={16} strokeWidth={2} />
    </Link>
  );
}
