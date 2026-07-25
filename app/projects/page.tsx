import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { CTA } from "@/components/sections/CTA";
import { getPage, listProperties } from "@/lib/cms";
import { toProperty } from "@/lib/cms-mappers";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Villas, apartments, plots and gated communities across Hyderabad and Bangalore — every one DTCP-approved and RERA-registered.",
};

const FALLBACK_HERO = {
  heading: "Our Projects",
  body: "Villas, apartments, plots and gated communities across Hyderabad and Bangalore — every one DTCP-approved and RERA-registered.",
};

const FALLBACK_CTA = {
  heading: "Can't find what you're looking for?",
  description: "Tell us your requirements and our consultants will match you with upcoming inventory.",
  button_label: "TALK TO A CONSULTANT",
  button_href: "/contact",
};

export default async function ProjectsPage() {
  const [{ items }, projectsPage] = await Promise.all([
    listProperties().catch(() => ({ items: [], total: 0 })),
    getPage("projects").catch(() => null),
  ]);
  const properties = items.map(toProperty);

  const textBlock = projectsPage?.blocks.find((b) => b.type === "text");
  const hero = { ...FALLBACK_HERO, ...textBlock?.config };
  const ctaBlock = projectsPage?.blocks.find((b) => b.type === "cta");
  const cta = { ...FALLBACK_CTA, ...ctaBlock?.config };

  return (
    <>
      <PageHero
        title={hero.heading}
        subtitle={hero.body}
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <ProjectsGrid properties={properties} />
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
