"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoHeader from "@/public/images/extracted/logo-header.png";
import { AccountLink } from "@/components/layout/AccountLink";
import { GetInTouchMenu } from "@/components/layout/GetInTouchMenu";
import { Container } from "@/components/ui/Container";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

export function Header({ mainNav }: { mainNav: NavLink[] }) {
  const scrolled = useScrolled(80);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b transition-[background,backdrop-filter,border-color,padding] duration-300",
        scrolled
          ? "border-navy-900/8 bg-[rgba(255,250,250,0.95)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container size="wide">
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-[padding] duration-300",
            scrolled ? "py-2" : "py-1.5"
          )}
        >
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={logoHeader}
              alt="Truzon Homes"
              priority
              className={cn(
                "w-auto transition-[height,filter] duration-300",
                scrolled ? "h-24" : "h-[104px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
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
                    scrolled
                      ? active
                        ? "border-gold-500 font-semibold text-gold-500"
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

          <div className="flex items-center gap-4 lg:gap-[22px]">
            <div className="hidden items-center gap-5 lg:flex">
              <AccountLink scrolled={scrolled} />
              <Link
                href="/login"
                className={cn(
                  "text-[13px] font-medium",
                  scrolled ? "text-navy-900" : "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
                )}
              >
                Login
              </Link>
              <GetInTouchMenu scrolled={scrolled} />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={cn("cursor-pointer lg:hidden", scrolled ? "text-navy-900" : "text-white")}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden bg-surface lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-3 text-sm font-medium text-navy-900 hover:bg-surface-muted"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-navy-900 hover:bg-surface-muted"
              >
                Login
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
