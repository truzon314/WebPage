"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { BlogPost } from "@/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function LatestInsights({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-16 lg:py-[90px]">
      <Container>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <h2 className="inline-block border-b-[3px] border-gold-400 pb-3 font-heading text-[28px] font-bold text-navy-900 sm:text-[32px]">
            Latest Insights
          </h2>
          <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
            All Articles <ArrowRight size={15} />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={item} whileHover={{ y: -4 }}>
              <Link
                href={`/blog/${post.slug}`}
                className="block overflow-hidden rounded-[10px] bg-surface shadow-[0_2px_18px_rgba(18,23,43,0.08)]"
              >
                <div className="relative h-[170px] w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-[22px] pb-6 pt-5">
                  <div className="mb-2.5 text-[10.5px] font-bold tracking-[0.5px] text-gold-600">
                    {post.category.toUpperCase()}
                  </div>
                  <div className="mb-2.5 font-heading text-[17px] font-bold leading-[1.4] text-navy-900">
                    {post.title}
                  </div>
                  <div className="text-[13px] leading-[1.6] text-text-muted">{post.excerpt}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
