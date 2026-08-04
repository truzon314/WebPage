"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { AccordionItem } from "@/modules/content/Accordion";
import { FAQS } from "@/modules/content/constants/faqs";
import type { FaqItem } from "@/modules/content/types";

export function FAQ({ heading = "Common Questions", items = FAQS }: { heading?: string; items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="bg-surface-muted py-16 lg:py-[90px]">
      <Container size="narrow">
        <h2 className="mb-10 text-center font-heading text-[28px] font-bold text-navy-900 sm:text-[32px]">
          {heading}
        </h2>
        <div className="flex flex-col gap-3.5">
          {items.map((item, i) => (
            <AccordionItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((current) => (current === i ? -1 : i))}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
