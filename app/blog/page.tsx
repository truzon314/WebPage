import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CmsBlockRenderer } from "@/modules/content/CmsBlockRenderer";
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

export default async function BlogPage() {
  const [{ items }, blogPage] = await Promise.all([
    listBlogPosts().catch(() => ({ items: [], total: 0 })),
    getPage("blog").catch(() => null),
  ]);
  const posts = items.map(toBlogPost);

  const textBlock = blogPage?.blocks.find((b) => b.type === "text");
  const hero = { ...FALLBACK_HERO, ...textBlock?.config };

  // Filter out the "text" block used for the hero — remaining blocks
  // (e.g. cta, or any future CMS blocks) render dynamically.
  const remainingBlocks =
    blogPage?.blocks.filter((b) => b.type !== "text") ?? [];

  return (
    <>
      <PageHero
        title={hero.heading}
        subtitle={hero.body}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <BlogGrid posts={posts} />
      {remainingBlocks.length > 0 && (
        <CmsBlockRenderer blocks={remainingBlocks} />
      )}
    </>
  );
}
