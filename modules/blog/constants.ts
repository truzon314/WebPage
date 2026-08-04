import insight1 from "@/public/images/placeholders/insight-1.png";
import insight2 from "@/public/images/placeholders/insight-2.png";
import insight3 from "@/public/images/placeholders/insight-3.png";
import insight4 from "@/public/images/placeholders/insight-4.png";
import insight5 from "@/public/images/placeholders/insight-5.png";
import insight6 from "@/public/images/placeholders/insight-6.png";
import type { BlogPost } from "@/modules/blog/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "inflation-hedge",
    category: "Real Estate Trends",
    title: "Why Luxury Real Estate is the Best Hedge Against Inflation",
    excerpt:
      "Exploring the resilience of premium properties in the current economic landscape, and why high-net-worth buyers keep coming back to bricks and mortar.",
    image: insight1,
    readTime: "6 min read",
  },
  {
    slug: "sustainable-luxury",
    category: "Lifestyle",
    title: "The Future of Sustainable Luxury: Modern Gated Communities",
    excerpt:
      "How Truzon Homes is integrating renewable energy and organic green spaces into modern gated living.",
    image: insight2,
    readTime: "5 min read",
  },
  {
    slug: "localities-2027",
    category: "Investment Guide",
    title: "Top 5 Localities to Watch in Hyderabad for 2027",
    excerpt:
      "An in-depth analysis of emerging hotspots with the highest potential for capital appreciation.",
    image: insight3,
    readTime: "7 min read",
  },
  {
    slug: "rera-compliance-checklist",
    category: "Buying Guide",
    title: "RERA Compliance: What Every Buyer Should Check",
    excerpt:
      "A practical checklist for verifying approvals before you sign — and the documents your developer should hand over unprompted.",
    image: insight4,
    readTime: "4 min read",
  },
  {
    slug: "villa-vs-apartment",
    category: "Lifestyle",
    title: "Villa vs Apartment: Which Suits Your Lifestyle?",
    excerpt:
      "Weighing space, privacy and maintenance to help you decide between a gated villa community and a high-rise residence.",
    image: insight5,
    readTime: "5 min read",
  },
  {
    slug: "capital-appreciation-plots-vs-homes",
    category: "Investment Guide",
    title: "Reading Capital Appreciation: Plots vs Built Homes",
    excerpt:
      "How land and constructed inventory tend to appreciate differently — and what that means for your holding period.",
    image: insight6,
    readTime: "6 min read",
  },
];
