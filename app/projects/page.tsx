import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CTA } from "@/modules/content/CTA";
import { getPage, getSettings } from "@/modules/content/api";
import { ProjectsGrid } from "@/modules/properties/ProjectsGrid";
import { listCategories, listProperties } from "@/modules/properties/api";
import { toProperty } from "@/modules/properties/mappers";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [projectsPage, settings] = await Promise.all([
    getPage("projects").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: projectsPage?.seo,
    settings,
    path: "/projects",
    fallbackTitle: "Projects",
    fallbackDescription:
      "Villas, apartments, plots and gated communities across Hyderabad and Bangalore — every one DTCP-approved and RERA-registered.",
  });
}

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
  const [{ items }, projectsPage, propertyTypes] = await Promise.all([
    listProperties().catch(() => ({ items: [], total: 0 })),
    getPage("projects").catch(() => null),
    listCategories("property").catch(() => []),
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
      <ProjectsGrid properties={properties} types={propertyTypes.map((t) => t.name)} />
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
