"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { BlogPost } from "@/modules/blog/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
    });
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTag === "All") return posts;
    return posts.filter(
      (p) =>
        p.tags?.includes(selectedTag) ||
        p.category.toLowerCase() === selectedTag.toLowerCase()
    );
  }, [posts, selectedTag]);

  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Tag Filters */}
        {allTags.length > 1 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-900/60">
              <Tag size={13} />
              Filter by:
            </span>
            {allTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-navy-900 text-white shadow-sm"
                      : "bg-surface-subtle text-navy-800 hover:bg-gold-500/15 hover:text-navy-950 border border-border"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-text-muted">
            No articles found for tag &ldquo;{selectedTag}&rdquo;.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTag}
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPosts.map((post) => (
                <motion.div key={post.slug} variants={item} whileHover={{ y: -4 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex h-full flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_2px_18px_rgba(18,23,43,0.08)] border border-gray-100 hover:border-gold-400/40 transition-colors"
                  >
                    <div className="relative h-[180px] w-full bg-navy-950/5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col px-[22px] pb-6 pt-5">
                      <div className="mb-2 text-[10.5px] font-bold tracking-[0.5px] text-gold-600">
                        {post.category.toUpperCase()}
                      </div>
                      <div className="mb-2.5 font-heading text-[17px] font-bold leading-[1.4] text-navy-900">
                        {post.title}
                      </div>
                      <p className="mb-4 flex-1 text-[13px] leading-[1.6] text-text-muted">
                        {post.excerpt}
                      </p>

                      {/* Tags & Read Time footer */}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {post.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="rounded bg-navy-900/5 px-2 py-0.5 text-[11px] font-medium text-navy-800"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        {post.readTime ? (
                          <div className="flex items-center gap-1 text-[11.5px] text-text-faint">
                            <Clock size={12} />
                            {post.readTime}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </section>
  );
}
