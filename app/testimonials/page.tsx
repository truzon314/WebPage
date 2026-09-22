import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { TestimonialsPage } from "@/modules/testimonials/TestimonialsPage";
import { listTestimonials } from "@/modules/testimonials/api";
import { toTestimonial } from "@/modules/testimonials/mappers";
import { getPage, getSettings } from "@/modules/content/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata(): Promise<Metadata> {
  const [testimonialsPage, settings] = await Promise.all([
    getPage("testimonials").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: testimonialsPage?.seo,
    settings,
    path: "/testimonials",
    fallbackTitle: "Customer Reviews & Resident Testimonials",
    fallbackDescription:
      "Read genuine experiences and reviews from families, homebuyers, and property investors who built their dream homes with Truzon Homes.",
  });
}

export default async function Page() {
  const cmsTestimonials = await listTestimonials().catch(() => []);
  const testimonials = cmsTestimonials.map(toTestimonial);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "Testimonials", url: "/testimonials" },
          ],
          SITE_URL
        )}
      />
      <PageHero
        title="Resident Testimonials"
        subtitle="Real stories from families and investors who chose Truzon Homes."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />
      <TestimonialsPage testimonials={testimonials} />
    </>
  );
}
