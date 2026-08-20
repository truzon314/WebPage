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

export function Header({
  mainNav,
  logoUrl,
}: {
  mainNav: NavLink[];
  logoUrl?: string | null;
}) {
  const scrolled = useScrolled(80);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/";
  const isSolid = !isHome || scrolled;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /*
   * MOBILE:
   *   Solid background = #FCFCFD
   *
   * DESKTOP:
   *   Keep previous appearance.
   *   Homepage at top = transparent over hero.
   *   Scrolled / other pages = previous solid background.
   */
  const headerBg = isSolid
    ? "bg-[#FCFCFD] lg:bg-[rgba(255,250,250,0.98)]"
    : "bg-[#FCFCFD] lg:bg-transparent";

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b border-navy-900/8 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md transition-[background,backdrop-filter,border-color,padding] duration-300",
        headerBg,
        !isHome && "lg:sticky",
        !isSolid &&
          "lg:border-transparent lg:shadow-none lg:backdrop-blur-none",
      )}
    >
      <Container size="wide">
        <div
          className={cn(
            "flex items-center justify-between gap-6 py-3 transition-[padding] duration-300 lg:grid lg:grid-cols-[auto_1fr_auto] lg:justify-normal",
            isSolid ? "lg:py-2" : "lg:py-1.5",
          )}
        >
          <Link
            href="/"
            className="relative flex shrink-0 items-center"
          >
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-[7%] top-[15%] h-9 w-9 -z-10 rounded-full opacity-0 transition-opacity duration-300 lg:h-16 lg:w-16",
                !isSolid && "lg:opacity-100",
              )}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(68, 142, 226, 0.12) 0%, rgba(0,0,0,0) 70%)",
              }}
            />

            <Image
              src={logoUrl || logoHeader}
              alt="Truzon Homes"
              priority
              {...(logoUrl ? { width: 400, height: 120 } : {})}
              className={cn(
                "relative h-20 w-auto transition-[height] duration-300",
                isSolid ? "lg:h-24" : "lg:h-[104px]",
              )}
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="hidden flex-wrap items-center justify-center gap-9 lg:flex"
          >
            {mainNav.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

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
                        : "border-transparent text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] hover:border-gold-200 hover:text-gold-200",
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

            {/* Mobile menu button only */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={
                mobileMenuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-nav"
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-md transition-colors lg:hidden",
                "text-[#1E2038] hover:bg-[#D4A637] hover:text-[#FCFCFD]",
              )}
            >
              {mobileMenuOpen ? (
                <X size={34} />
              ) : (
                <Menu size={34} />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile primary navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.28,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-x-0 top-full overflow-hidden shadow-lg lg:hidden"
          >
            <nav
              id="mobile-primary-nav"
              aria-label="Mobile primary"
              className="flex flex-col border-t border-[#1E2038]/10 bg-[#FAF9F2] backdrop-blur-md"
            >
              {mainNav.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "border-b border-[#1E2038]/10 px-6 py-4 text-[13px] font-semibold tracking-[0.5px] transition-colors",
                      active
                        ? "bg-[#D4A637] text-[#FCFCFD]"
                        : "text-[#1E2038] hover:bg-[#D4A637] hover:text-[#FCFCFD]",
                    )}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}