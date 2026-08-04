import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CTA } from "@/modules/content/CTA";
import { getPage } from "@/modules/content/api";
import { BlogGrid } from "@/modules/blog/BlogGrid";
import { listBlogPosts } from "@/modules/blog/api";
import { toBlogPost } from "@/modules/blog/mappers";

export const metadata: Metadata = {
  title: "Blog",
  description: "Market trends, buying guides and life inside a Truzon community.",
};

const FALLBACK_HERO = {
  heading: "Insights & Articles",
  body: "Market trends, buying guides and life inside a Truzon community.",
};

const FALLBACK_CTA = {
  heading: "Have a question we haven't covered?",
  description:
    "Our consultants are happy to walk you through anything — market timing, financing, or a specific project.",
  button_label: "ASK OUR TEAM",
  button_href: "/contact",
};

export default async function BlogPage() {
  const [{ items }, blogPage] = await Promise.all([
    listBlogPosts().catch(() => ({ items: [], total: 0 })),
    getPage("blog").catch(() => null),
  ]);
  const posts = items.map(toBlogPost);

  const textBlock = blogPage?.blocks.find((b) => b.type === "text");
  const hero = { ...FALLBACK_HERO, ...textBlock?.config };
  const ctaBlock = blogPage?.blocks.find((b) => b.type === "cta");
  const cta = { ...FALLBACK_CTA, ...ctaBlock?.config };

  return (
    <>
      <PageHero
        title={hero.heading}
        subtitle={hero.body}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <BlogGrid posts={posts} />
      <CTA
        title={cta.heading}
        description={cta.description}
        primaryLabel={cta.button_label}
        primaryHref={cta.button_href}
        showPhoneLink={false}
      />
    </>
  );
}
