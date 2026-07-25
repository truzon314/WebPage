import avatar1 from "@/public/images/placeholders/avatar-1.png";
import avatar2 from "@/public/images/placeholders/avatar-2.png";
import avatar3 from "@/public/images/placeholders/avatar-3.png";
import type { Testimonial } from "@/types";

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Arvind & Mrs. Shreya Reddy",
    role: "Azure Heights Residents",
    avatar: avatar1,
    quote:
      "Investing with Truzon Homes was the best decision for our family. The transparency, the architectural brilliance, and the seamless handover made the entire journey a pleasure. Our villa at Azure Heights is everything we dreamed of and more.",
  },
  {
    name: "Karthik Menon",
    role: "Elysian Woods Resident",
    avatar: avatar2,
    quote:
      "What stood out was the craftsmanship — every corner of Elysian Woods feels considered. The construction updates were honest and on schedule, which is rare in this market.",
  },
  {
    name: "Priya & Suresh Rao",
    role: "The Grand Estate Investors",
    avatar: avatar3,
    quote:
      "We were new to plot investments and the Truzon team walked us through every DTCP and title detail patiently. The Grand Estate has already appreciated well beyond what we expected.",
  },
];
