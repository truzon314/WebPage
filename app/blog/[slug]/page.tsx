import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/modules/content/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPost } from "@/modules/blog/api";
import { toBlogPost } from "@/modules/blog/mappers";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

import { BLOG_POSTS } from "@/modules/blog/constants";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cmsPost = await getBlogPost(slug).catch(() => null);
  const fallbackPost = BLOG_POSTS.find((p) => p.slug === slug);
  if (!cmsPost && !fallbackPost) return { title: "Article Not Found" };

  return buildMetadata({
    seo: cmsPost?.seo,
    path: `/blog/${slug}`,
    fallbackTitle: cmsPost?.title || fallbackPost?.title || "Blog Article",
    fallbackDescription: cmsPost?.excerpt || fallbackPost?.excerpt || "",
    fallbackImage: cmsPost?.featured_image_url,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmsPost = await getBlogPost(slug).catch(() => null);
  const fallbackPost = BLOG_POSTS.find((p) => p.slug === slug);

  if (!cmsPost && !fallbackPost) notFound();

  const post = cmsPost ? toBlogPost(cmsPost) : fallbackPost!;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${slug}` },
          ],
          SITE_URL
        )}
      />
      <JsonLd
        data={
          cmsPost
            ? cmsPost.seo?.schema_jsonld || articleJsonLd(cmsPost, SITE_URL)
            : {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt,
              }
        }
      />
      <PageHero
        title={post.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="py-16">
        <Container size="narrow">
          <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-[10px] sm:h-[380px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 820px) 820px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.5px] text-gold-600">
              {post.category.toUpperCase()}
              {post.readTime ? (
                <span className="flex items-center gap-1.5 font-semibold text-text-faint">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              ) : null}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-navy-900/5 px-2.5 py-0.5 text-xs font-semibold text-navy-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mb-10 space-y-4 text-[15.5px] leading-[1.8] text-text-body whitespace-pre-line">
            {post.body || post.excerpt}
          </div>
          <Button href="/blog" variant="outline-dark">
            Back to Blog
          </Button>
        </Container>
      </article>
    </>
  );
}
