import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CmsBlockRenderer } from "@/modules/content/CmsBlockRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getSettings } from "@/modules/content/api";
import { BlogGrid } from "@/modules/blog/BlogGrid";
import { listBlogPosts } from "@/modules/blog/api";
import { toBlogPost } from "@/modules/blog/mappers";
import { BLOG_POSTS } from "@/modules/blog/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata(): Promise<Metadata> {
  const [blogPage, settings] = await Promise.all([
    getPage("blog").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: blogPage?.seo,
    settings,
    path: "/blog",
    fallbackTitle: "Blog & Real Estate Insights",
    fallbackDescription:
      "Market trends, buying guides, investment advice, and community stories from Truzon Homes across Hyderabad and Bangalore.",
  });
}

const FALLBACK_HERO = {
  heading: "Insights & Articles",
  body: "Market trends, buying guides and life inside a Truzon community.",
};

export default async function BlogPage() {
  const [{ items }, blogPage] = await Promise.all([
    listBlogPosts().catch(() => ({ items: [], total: 0 })),
    getPage("blog").catch(() => null),
  ]);
  const posts = items.length > 0 ? items.map(toBlogPost) : BLOG_POSTS;


  const textBlock = blogPage?.blocks.find((b) => b.type === "text");
  const hero = { ...FALLBACK_HERO, ...textBlock?.config };

  // Filter out the "text" block used for the hero — remaining blocks
  // (e.g. cta, or any future CMS blocks) render dynamically.
  const remainingBlocks =
    blogPage?.blocks.filter((b) => b.type !== "text") ?? [];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
          ],
          SITE_URL
        )}
      />
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
