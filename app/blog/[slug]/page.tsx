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
import { articleJsonLd, buildMetadata } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return { title: "Article Not Found" };
  return buildMetadata({
    seo: post.seo,
    path: `/blog/${slug}`,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt || "",
    fallbackImage: post.featured_image_url,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cmsPost = await getBlogPost(slug).catch(() => null);
  if (!cmsPost) notFound();
  const post = toBlogPost(cmsPost);

  return (
    <>
      <JsonLd data={cmsPost.seo?.schema_jsonld || articleJsonLd(cmsPost, SITE_URL)} />
      <PageHero
        title={post.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="py-16">
        <Container size="narrow">
          <div className="relative mb-8 h-[260px] w-full overflow-hidden rounded-[10px] sm:h-[360px]">
            <Image src={post.image} alt={post.title} fill sizes="(min-width: 820px) 820px, 100vw" className="object-cover" priority />
          </div>
          <div className="mb-3 flex items-center gap-3 text-[11px] font-bold tracking-[0.5px] text-gold-600">
            {post.category.toUpperCase()}
            {post.readTime ? (
              <span className="flex items-center gap-1.5 font-semibold text-text-faint">
                <Clock size={12} />
                {post.readTime}
              </span>
            ) : null}
          </div>
          <p className="mb-8 text-[15px] leading-[1.8] text-text-body">{post.body || post.excerpt}</p>
          <Button href="/blog" variant="outline-dark">
            Back to Blog
          </Button>
        </Container>
      </article>
    </>
  );
}
