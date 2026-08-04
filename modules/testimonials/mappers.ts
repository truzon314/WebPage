import type { CmsTestimonial } from "@/modules/testimonials/api";
import type { Testimonial } from "@/modules/testimonials/types";

export function toTestimonial(t: CmsTestimonial): Testimonial {
  return {
    id: t.id,
    name: t.name,
    roleOrLocation: t.role_or_location,
    quote: t.quote,
    photoUrl: t.photo_url,
    rating: t.rating,
  };
}
