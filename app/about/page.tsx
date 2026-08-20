import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageHero } from "@/modules/content/PageHero";
import { CmsBlockRenderer } from "@/modules/content/CmsBlockRenderer";
import { getPage, getSettings } from "@/modules/content/api";
import { buildMetadata } from "@/lib/seo";

// Below-the-fold sections — code-split out of the initial JS bundle (still
// server-rendered) since OurStory above already owns first paint here.
const AboutValues = dynamic(
  () => import("@/modules/content/AboutValues").then((m) => m.AboutValues)
);
const Stats = dynamic(
  () => import("@/modules/content/Stats").then((m) => m.Stats)
);
const Certifications = dynamic(
  () =>
    import("@/modules/content/Certifications").then(
      (m) => m.Certifications
    )
);

export async function generateMetadata(): Promise<Metadata> {
  const [aboutPage, settings] = await Promise.all([
    getPage("about").catch(() => null),
    getSettings().catch(() => null),
  ]);

  return buildMetadata({
    seo: aboutPage?.seo,
    settings,
    path: "/about",
    fallbackTitle: "About Us",
    fallbackDescription:
      "15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time.",
  });
}

export default async function AboutPage() {
  const aboutPage = await getPage("about").catch(() => null);

  return (
    <>
      <PageHero
        title="About Truzon Homes"
        subtitle="15+ years of building legacies across Hyderabad and Bangalore — one architecturally considered home at a time."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      {/* CMS blocks rendered in position order (text → team → cta, etc.) */}
      {aboutPage?.blocks && (
        <CmsBlockRenderer blocks={aboutPage.blocks} />
      )}

      <AboutValues />

      <Stats />

      <Certifications />
    </>
  );
}