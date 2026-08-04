"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/modules/testimonials/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { index, select } = useAutoRotate(testimonials.length, 6500);

  if (testimonials.length === 0) return null;
  const active = testimonials[index];

  return (
    <section className="bg-surface-muted py-16 lg:py-[90px]">
      <Container size="narrow" className="text-center">
        <h2 className="mb-11 font-heading text-[28px] font-bold text-navy-900 sm:text-[32px]">
          Words from Our Residents
        </h2>
        <div className="rounded-xl bg-surface px-8 py-12 shadow-[0_4px_24px_rgba(18,23,43,0.06)] sm:px-14 sm:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-7 text-[16.5px] italic leading-[1.8] text-text-quote">&ldquo;{active.quote}&rdquo;</p>
              <div className="flex flex-col items-center gap-2.5">
                {active.photoUrl ? (
                  <Image src={active.photoUrl} alt={active.name} width={56} height={56} className="rounded-full object-cover" />
                ) : null}
                <div className="text-[14.5px] font-bold text-navy-900">{active.name}</div>
                {active.roleOrLocation ? (
                  <div className="text-[12.5px] text-text-muted">{active.roleOrLocation}</div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-[26px] flex justify-center gap-2.5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === index}
              className="flex h-8 w-8 items-center justify-center cursor-pointer"
            >
              <span
                aria-hidden
                className={cn(
                  "h-[9px] w-[9px] rounded-full transition-colors",
                  i === index ? "bg-gold-400" : "bg-[#c7cedb]"
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
