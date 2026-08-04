import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero, type HeroSlide } from "@/modules/content/Hero";
import { getPage, getSettings } from "@/modules/content/api";
import { toTelHref } from "@/modules/content/mappers";
import { SignatureCollections } from "@/modules/properties/SignatureCollections";
import { PropertySearchProvider } from "@/modules/properties/PropertySearchContext";
import { listCategories, listProperties } from "@/modules/properties/api";
import { toProperty } from "@/modules/properties/mappers";
import { listBlogPosts } from "@/modules/blog/api";
import { toBlogPost } from "@/modules/blog/mappers";
import { listTestimonials } from "@/modules/testimonials/api";
import { toTestimonial } from "@/modules/testimonials/mappers";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import { buildMetadata } from "@/lib/seo";
import type { FaqItem } from "@/modules/content/types";

// Below-the-fold sections — code-split out of the initial JS bundle (still
// server-rendered, `ssr` defaults to true) since none of them are needed
// for first paint or LCP, which are both owned by Hero above.
const ExploreCategories = dynamic(() =>
  import("@/modules/properties/ExploreCategories").then((m) => m.ExploreCategories)
);
const WhyChooseUs = dynamic(() => import("@/modules/content/WhyChooseUs").then((m) => m.WhyChooseUs));
const Stats = dynamic(() => import("@/modules/content/Stats").then((m) => m.Stats));
const Testimonials = dynamic(() => import("@/modules/content/Testimonials").then((m) => m.Testimonials));
const LatestInsights = dynamic(() => import("@/modules/blog/LatestInsights").then((m) => m.LatestInsights));
const FAQ = dynamic(() => import("@/modules/content/FAQ").then((m) => m.FAQ));
const CTA = dynamic(() => import("@/modules/content/CTA").then((m) => m.CTA));

export async function generateMetadata(): Promise<Metadata> {
  const [homePage, settings] = await Promise.all([getPage("home").catch(() => null), getSettings().catch(() => null)]);
  return buildMetadata({
    seo: homePage?.seo,
    settings,
    path: "/",
    fallbackTitle: "Home",
    fallbackDescription:
      "Discover architectural masterpieces and premium investment opportunities with Truzon Homes across Hyderabad and Bangalore.",
  });
}

const FALLBACK_CTA = {
  heading: "Ready to find your dream home?",
  description:
    "Our property consultants are available 24/7 to guide you through our exclusive inventory and investment plans.",
  button_label: "REQUEST A CALLBACK",
  button_href: "/contact",
};

const FALLBACK_HERO = {
  button_label: "EXPLORE PROPERTIES",
  button_href: "#collections",
  slides: [
    {
      heading: "Building Dreams. Creating Futures.",
      subheading:
        "Discover architectural masterpieces and premium investment opportunities in the most coveted locations. Experience the pinnacle of understated luxury.",
      image_url: "",
    },
  ],
};

export default async function Home() {
  const [homePage, { items: propertyItems }, { items: blogItems }, settings, propertyTypes, cmsTestimonials] =
    await Promise.all([
      getPage("home").catch(() => null),
      listProperties().catch(() => ({ items: [], total: 0 })),
      listBlogPosts({ per_page: 3 }).catch(() => ({ items: [], total: 0 })),
      getSettings().catch(() => null),
      listCategories("property").catch(() => []),
      listTestimonials({ featuredOnly: true }).catch(() => []),
    ]);

  const properties = propertyItems.map(toProperty);
  const posts = blogItems.map(toBlogPost);
  const testimonials = cmsTestimonials.map(toTestimonial);

  const heroBlock = homePage?.blocks.find((b) => b.type === "hero_banner");
  const hero = { ...FALLBACK_HERO, ...heroBlock?.config };
  const heroSlides: HeroSlide[] = (hero.slides.length > 0 ? hero.slides : FALLBACK_HERO.slides).map((s) => ({
    heading: s.heading,
    subheading: s.subheading,
    imageUrl: s.image_url || undefined,
  }));
  const faqBlock = homePage?.blocks.find((b) => b.type === "faq");
  const ctaBlock = homePage?.blocks.find((b) => b.type === "cta");
  const cta = { ...FALLBACK_CTA, ...ctaBlock?.config };

  return (
    <>
      <PropertySearchProvider properties={properties}>
        <Hero
          slides={heroSlides}
          buttonLabel={hero.button_label}
          buttonHref={hero.button_href}
          propertyTypes={propertyTypes.map((t) => t.name)}
        />
        <SignatureCollections />
      </PropertySearchProvider>
      <ExploreCategories />
      <WhyChooseUs imageUrl={settings?.why_choose_image_url} />
      <Stats />
      <Testimonials testimonials={testimonials} />
      <LatestInsights posts={posts} />
      <FAQ heading={faqBlock?.config.heading} items={faqBlock?.config.items as FaqItem[] | undefined} />
      <CTA
        title={cta.heading}
        description={cta.description}
        primaryLabel={cta.button_label}
        primaryHref={cta.button_href}
        phoneDisplay={settings?.callback_phone ?? undefined}
        phoneHref={toTelHref(settings?.callback_phone) ?? CONTACT_INFO.callbackPhoneHref}
      />
    </>
  );
}
