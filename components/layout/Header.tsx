"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoHeader from "@/public/images/extracted/Logo.svg";
import { GetInTouchMenu } from "@/components/layout/GetInTouchMenu";
import { Container } from "@/components/ui/Container";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

export function Header({ mainNav, logoUrl }: { mainNav: NavLink[]; logoUrl?: string | null }) {
  const scrolled = useScrolled(80);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Below lg: the header is always fixed/solid regardless of page or scroll
  // (Hero.tsx/PageHero.tsx compensate with top padding). At lg: and up, the
  // home page's hero photo sits directly behind a transparent header, so it
  // stays `fixed` (overlaying) there; every other page uses PageHero's solid
  // navy banner instead — `fixed` would overlay that too, so those pages use
  // `sticky`, which reserves real space in the document flow.
  const isHome = pathname === "/";
  const isSolid = !isHome || scrolled;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        // Mobile (below lg:) is always fixed, solid, and shadowed — desktop
        // keeps the original transparent-over-hero/sticky behavior, applied
        // only via lg: overrides so it's untouched pixel-for-pixel.
        "fixed inset-x-0 top-0 z-[100] border-b border-navy-900/8 bg-[rgba(255,250,250,0.98)] pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md transition-[background,backdrop-filter,border-color,padding] duration-300",
        !isHome && "lg:sticky",
        !isSolid && "lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none"
      )}
    >
      <Container size="wide">
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto] items-center gap-6 py-3 transition-[padding] duration-300",
            isSolid ? "lg:py-2" : "lg:py-1.5"
          )}
        >
          <Link href="/" className="relative flex shrink-0 items-center">
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-[7%] top-[15%] h-9 w-9 -z-10 rounded-full opacity-0 transition-opacity duration-300 lg:h-16 lg:w-16",
                !isSolid && "lg:opacity-100"
              )}
              style={{
                background: "radial-gradient(ellipse at center, rgba(68, 142, 226, 0.12) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
            <Image
              src={logoUrl || logoHeader}
              alt="Truzon Homes"
              priority
              {...(logoUrl ? { width: 400, height: 120 } : {})}
              className={cn(
                "relative h-20 w-auto transition-[height] duration-300",
                isSolid ? "lg:h-24" : "lg:h-[104px]"
              )}
            />
          </Link>

          <nav aria-label="Primary" className="hidden flex-wrap items-center justify-center gap-9 lg:flex">
            {mainNav.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b-2 pb-1.5 text-[13px] font-medium tracking-[0.5px] transition-all hover:-translate-y-0.5",
                    isSolid
                      ? active
                        ? "border-gold-500 font-semibold text-gold-600"
                        : "border-transparent text-navy-800 hover:border-navy-900 hover:text-navy-900"
                      : active
                        ? "border-gold-200 font-semibold text-gold-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
                        : "border-transparent text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] hover:border-gold-200 hover:text-gold-200"
                  )}
                >
                  {link.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-4 lg:gap-[22px]">
            <div className="hidden items-center gap-5 lg:flex">
              <GetInTouchMenu scrolled={isSolid} />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-nav"
              className="flex h-14 w-14 items-center justify-center rounded-md text-navy-900 transition-colors hover:bg-navy-900/5 lg:hidden"
            >
              {mobileMenuOpen ? <X size={34} /> : <Menu size={34} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile primary navigation — a top-right menu button that drops
          down the same links, instead of a persistent bottom bar. Desktop
          (lg: and up) is untouched; this is hidden there. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-primary-nav"
            aria-label="Mobile primary"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full flex flex-col border-t border-navy-900/10 bg-[rgba(255,250,250,0.98)] backdrop-blur-md shadow-lg lg:hidden"
          >
            {mainNav.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "border-b border-navy-900/6 px-6 py-4 text-[13px] font-semibold tracking-[0.5px] transition-colors",
                    active ? "text-gold-600" : "text-navy-800 hover:text-navy-900"
                  )}
                >
                  {link.label.toUpperCase()}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
