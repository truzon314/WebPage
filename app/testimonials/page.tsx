import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { TestimonialsPage } from "@/modules/testimonials/TestimonialsPage";
import { listTestimonials } from "@/modules/testimonials/api";
import { toTestimonial } from "@/modules/testimonials/mappers";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what Truzon Homes residents and investors have to say.",
};

export default async function Page() {
  const cmsTestimonials = await listTestimonials().catch(() => []);
  const testimonials = cmsTestimonials.map(toTestimonial);

  return (
    <>
      <PageHero
        title="Resident Testimonials"
        subtitle="Real stories from families and investors who chose Truzon Homes."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />
      <TestimonialsPage testimonials={testimonials} />
    </>
  );
}
