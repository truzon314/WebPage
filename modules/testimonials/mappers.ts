import type { CmsTestimonial } from "@/modules/testimonials/api";
import type { Testimonial } from "@/modules/testimonials/types";
import { resolveMediaUrl } from "@/lib/cms-client";

export function toTestimonial(t: CmsTestimonial): Testimonial {
  return {
    id: t.id,
    name: t.name,
    roleOrLocation: t.role_or_location,
    quote: t.quote,
    photoUrl: resolveMediaUrl(t.photo_url) ?? null,
    rating: t.rating,
  };
}