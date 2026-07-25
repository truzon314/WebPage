import type { Metadata } from "next";
import { Hero, type HeroSlide } from "@/components/sections/Hero";
import { SignatureCollections } from "@/components/sections/SignatureCollections";
import { ExploreCategories } from "@/components/sections/ExploreCategories";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { LatestInsights } from "@/components/sections/LatestInsights";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { PropertySearchProvider } from "@/lib/context/PropertySearchContext";
import { getPage, getSettings, listBlogPosts, listProperties } from "@/lib/cms";
import { toBlogPost, toProperty, toTelHref } from "@/lib/cms-mappers";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import type { FaqItem } from "@/types";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover architectural masterpieces and premium investment opportunities with Truzon Homes across Hyderabad and Bangalore.",
};

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
  const [homePage, { items: propertyItems }, { items: blogItems }, settings] = await Promise.all([
    getPage("home").catch(() => null),
    listProperties().catch(() => ({ items: [], total: 0 })),
    listBlogPosts({ per_page: 3 }).catch(() => ({ items: [], total: 0 })),
    getSettings().catch(() => null),
  ]);

  const properties = propertyItems.map(toProperty);
  const posts = blogItems.map(toBlogPost);

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
        <Hero slides={heroSlides} buttonLabel={hero.button_label} buttonHref={hero.button_href} />
        <SignatureCollections />
      </PropertySearchProvider>
      <ExploreCategories />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
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
