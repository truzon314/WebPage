"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { SearchBar } from "@/components/sections/SearchBar";
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
}

export function Hero({ slides, buttonLabel, buttonHref }: HeroProps) {
  const { index, pause, resume, select } = useAutoRotate(slides.length, 5000);
  const slide = slides[index];

  return (
    <section
      className="relative min-h-[880px]"
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,32,0.24)_0%,rgba(8,15,32,0.36)_35%,rgba(8,15,32,0.72)_100%)]" />

      {/* Dedicated top vignette — the main gradient above is lightest right where the
          transparent fixed Header/logo sits, so the logo can get lost against a bright
          hero photo without this. */}
      <div className="absolute inset-x-0 top-0 h-[220px] bg-[linear-gradient(180deg,rgba(3,8,20,0.75)_0%,rgba(3,8,20,0.4)_50%,rgba(3,8,20,0)_100%)]" />

      <Container size="wide" className="relative z-10 pt-[140px] pb-24 sm:pt-[180px] lg:pt-[210px]">
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
              <h1 className="mb-5 font-heading text-[40px] font-bold leading-[1.12] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-[52px] lg:text-[68px]">
                {slide.heading}
              </h1>
              <p className="mb-8 max-w-[480px] text-base leading-[1.7] text-[#c7cedb]">{slide.subheading}</p>
              <div className="flex flex-wrap gap-4">
                <Button href={buttonHref} variant="gold">
                  {buttonLabel}
                </Button>
                <Button href="/contact" variant="outline-light">
                  BOOK SITE VISIT
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <EnquiryForm />
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
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                i === index ? "w-[26px] bg-gold-400" : "w-2 bg-white/50"
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-[15] -mt-10 px-4 sm:px-8 lg:absolute lg:inset-x-[60px] lg:-bottom-[58px] lg:mt-0 lg:px-0">
        <SearchBar />
      </div>
    </section>
  );
}
