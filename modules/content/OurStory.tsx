"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { StaticImageData } from "next/image";
import storyPhoto from "@/public/images/placeholders/about-story-photo.png";
import { Container } from "@/components/ui/Container";
import { STORY_PARAGRAPHS } from "@/modules/content/constants/about";

interface OurStoryProps {
  heading?: string;
  paragraphs?: string[];
  image?: string | StaticImageData;
}

export function OurStory({
  heading = "Two decades of intent, not just construction",
  paragraphs = STORY_PARAGRAPHS,
  image = storyPhoto,
}: OurStoryProps) {
  return (
    <section className="py-16 lg:py-[90px]">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-[70px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative h-[280px] w-full overflow-hidden rounded-[10px] sm:h-[380px]"
        >
          <Image
            src={image || storyPhoto}
            alt="Truzon Homes leadership and site team"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-3 text-[11px] font-bold tracking-[0.5px] text-gold-600">OUR STORY</div>
          <h2 className="mb-5 font-heading text-[26px] font-bold leading-tight text-navy-900 sm:text-[30px]">
            {heading}
          </h2>
          <div className="flex flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[14.5px] leading-[1.8] text-text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
