"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/modules/leads/EnquiryForm";
import { SearchBar } from "@/modules/properties/SearchBar";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { cn } from "@/lib/utils";
import heroVillaStreet from "@/public/images/extracted/hero-villa-street.jpg";

export interface HeroSlide {
  heading: string;
  subheading: string;
  imageUrl?: string;
}

interface HeroProps {
  slides: HeroSlide[];
  buttonLabel: string;
  buttonHref: string;
  propertyTypes?: string[];
}

export function Hero({ slides, buttonLabel, buttonHref, propertyTypes }: HeroProps) {
  const { index, pause, resume, select } = useAutoRotate(slides.length, 5000);
  const slide = slides[index];

  return (
    <section
      className="relative min-h-[560px] lg:min-h-[880px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: i === index ? 1.08 : 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          >
            <Image
              src={s.imageUrl || heroVillaStreet}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,15,32,0)_0%,rgba(8,15,32,0.35)_55%,rgba(8,15,32,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(8,15,32,0.85)_0%,rgba(8,15,32,0)_60%)]" />

      <Container
        size="wide"
        className="relative z-10 pt-[calc(158px+env(safe-area-inset-top))] pb-24 sm:pt-[180px] lg:pt-[210px]"
      >
        <div className="flex flex-col flex-wrap items-start justify-between gap-10 md:flex-row">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[600px]"
            >
              <h1 className="mb-5 font-heading text-[32px] font-bold leading-[1.12] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-[52px] lg:text-[68px]">
                {slide.heading}
              </h1>
              <p className="mb-8 max-w-[480px] text-base leading-[1.7] text-[#c7cedb]">{slide.subheading}</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button href={buttonHref} variant="gold" className="px-5 py-3 text-[12px] sm:px-7 sm:py-4 sm:text-[13px]">
                  {buttonLabel}
                </Button>
                <Button
                  href="/contact"
                  variant="outline-light"
                  className="px-5 py-3 text-[12px] sm:px-7 sm:py-4 sm:text-[13px]"
                >
                  BOOK SITE VISIT
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick-enquiry card is desktop-only — kept off the mobile hero
              to keep it simple; the same lead flow still lives on /contact. */}
          <div className="hidden lg:block">
            <EnquiryForm types={propertyTypes} />
          </div>
        </div>
      </Container>

      <div className="absolute bottom-[110px] left-[60px] z-10 hidden animate-bounce-down sm:block">
        <ArrowDown size={22} strokeWidth={2} className="text-[#c7cedb]" aria-hidden="true" />
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-[70px] z-[12] flex justify-center gap-2.5 sm:bottom-[150px]">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show slide ${i + 1}: ${s.heading}`}
              aria-current={i === index}
              className="flex h-8 w-8 items-center justify-center cursor-pointer"
            >
              <span
                aria-hidden
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-[26px] bg-gold-400" : "w-2 bg-white/50"
                )}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Project filter box is desktop-only — removed from the mobile hero
          for a simpler, uncluttered mobile layout. */}
      <div className="hidden lg:absolute lg:inset-x-[60px] lg:-bottom-[58px] lg:z-[15] lg:block">
        <SearchBar types={propertyTypes} />
      </div>
    </section>
  );
}
