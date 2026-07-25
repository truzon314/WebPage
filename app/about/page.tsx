import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { OurStory } from "@/components/sections/OurStory";
import { AboutValues } from "@/components/sections/AboutValues";
import { Stats } from "@/components/sections/Stats";
import { Certifications } from "@/components/sections/Certifications";
import { CTA } from "@/components/sections/CTA";
import { getPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time.",
};

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

  return (
    <>
      <PageHero
        title="About Truzon Homes"
        subtitle="15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <OurStory heading={textBlock?.config.heading} paragraphs={paragraphs} />
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
