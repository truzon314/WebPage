import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageHero } from "@/modules/content/PageHero";
import { OurStory } from "@/modules/content/OurStory";
import { getPage, getSettings } from "@/modules/content/api";
import { buildMetadata } from "@/lib/seo";

// Below-the-fold sections — code-split out of the initial JS bundle (still
// server-rendered) since OurStory above already owns first paint here.
const AboutValues = dynamic(() => import("@/modules/content/AboutValues").then((m) => m.AboutValues));
const Stats = dynamic(() => import("@/modules/content/Stats").then((m) => m.Stats));
const Certifications = dynamic(() => import("@/modules/content/Certifications").then((m) => m.Certifications));
const CTA = dynamic(() => import("@/modules/content/CTA").then((m) => m.CTA));

export async function generateMetadata(): Promise<Metadata> {
  const [aboutPage, settings] = await Promise.all([getPage("about").catch(() => null), getSettings().catch(() => null)]);
  return buildMetadata({
    seo: aboutPage?.seo,
    settings,
    path: "/about",
    fallbackTitle: "About Us",
    fallbackDescription:
      "15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time.",
  });
}

const FALLBACK_CTA = {
  heading: "Want to see our work up close?",
  description: "Browse our current portfolio of villas, apartments, plots and gated communities.",
  button_label: "VIEW OUR PROJECTS",
  button_href: "/projects",
};

export default async function AboutPage() {
  const aboutPage = await getPage("about").catch(() => null);
  const textBlock = aboutPage?.blocks.find((b) => b.type === "text");
  const ctaBlock = aboutPage?.blocks.find((b) => b.type === "cta");
  const cta = { ...FALLBACK_CTA, ...ctaBlock?.config };
  const paragraphs: string[] | undefined = textBlock?.config.body
    ?.split("\n\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const storyImage = textBlock?.config.image_url || textBlock?.config.featured_image_url || textBlock?.config.image;

  return (
    <>
      <PageHero
        title="About Truzon Homes"
        subtitle="15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <OurStory heading={textBlock?.config.heading} paragraphs={paragraphs} image={storyImage} />
      <AboutValues />
      <Stats />
      <Certifications />
      <CTA
        title={cta.heading}
        description={cta.description}
        primaryLabel={cta.button_label}
        primaryHref={cta.button_href}
        showPhoneLink={false}
      />
    </>
  );
}
