"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Handshake, MapPin, ShieldCheck, type LucideIcon } from "lucide-react";
import whyChoosePhoto from "@/public/images/placeholders/why-choose-photo.png";
import { Container } from "@/components/ui/Container";
import { FEATURES } from "@/modules/content/constants/features";
import type { FeatureItem } from "@/modules/content/types";
import { resolveMediaUrl } from "@/lib/cms-client";

const ICONS: Record<FeatureItem["icon"], LucideIcon> = {
  shield: ShieldCheck,
  handshake: Handshake,
  location: MapPin,
  award: Award,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function WhyChooseUs({ imageUrl }: { imageUrl?: string | null }) {
  const resolvedImageUrl = resolveMediaUrl(imageUrl);

  return (
    <section className="py-16 lg:py-[90px]">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[70px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-[10px] sm:h-[420px]">
            <Image
              src={resolvedImageUrl || whyChoosePhoto}
              alt="The Truzon Homes team at work"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-px right-4 max-w-[230px] rounded-lg bg-navy-950 px-[30px] py-[26px] text-white shadow-[0_12px_30px_rgba(10,18,36,0.3)] sm:-right-[30px]">
            <div className="font-heading text-[38px] font-bold text-gold-400">15+</div>
            <div className="mt-1 text-[11px] leading-[1.5] tracking-[0.5px] text-[#c7cedb]">
              YEARS OF EXCELLENCE IN BUILDING LEGACIES
            </div>
          </div>
        </motion.div>

        <div>
          <h2 className="mb-8 font-heading text-[28px] font-bold text-navy-900 sm:text-[32px]">
            Why Choose Truzon Homes
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2"
          >
            {FEATURES.map((feature) => {
              const Icon = ICONS[feature.icon];
              return (
                <motion.div key={feature.title} variants={item} className="flex gap-3.5">
                  <Icon size={26} strokeWidth={1.8} className="mt-0.5 shrink-0 text-gold-400" />
                  <div>
                    <div className="mb-1.5 text-[15px] font-bold text-navy-900">{feature.title}</div>
                    <div className="text-[13.5px] leading-[1.6] text-text-body">{feature.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}