"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TESTIMONIALS } from "@/lib/constants/testimonials";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { index, select } = useAutoRotate(TESTIMONIALS.length, 6500);
  const active = TESTIMONIALS[index];

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
                <Image
                  src={active.avatar}
                  alt={active.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div className="text-[14.5px] font-bold text-navy-900">{active.name}</div>
                <div className="text-[12.5px] text-text-muted">{active.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-[26px] flex justify-center gap-2.5">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => select(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === index}
              className={cn(
                "h-[9px] w-[9px] rounded-full transition-colors cursor-pointer",
                i === index ? "bg-gold-400" : "bg-[#c7cedb]"
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
