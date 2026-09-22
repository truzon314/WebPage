import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CareersPage } from "@/modules/careers/CareersPage";
import { listCareers } from "@/modules/careers/api";
import { getPage, getSettings } from "@/modules/content/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata(): Promise<Metadata> {
  const [careersPage, settings] = await Promise.all([
    getPage("careers").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: careersPage?.seo,
    settings,
    path: "/careers",
    fallbackTitle: "Careers at Truzon Homes",
    fallbackDescription:
      "Join our team building architectural excellence, luxury villas, and premium communities across Hyderabad and Bangalore.",
  });
}

export default async function Page() {
  const careers = await listCareers().catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "Careers", url: "/careers" },
          ],
          SITE_URL
        )}
      />
      <PageHero
        title="Careers at Truzon Homes"
        subtitle="Join a team building architectural excellence across Hyderabad and Bangalore."
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />
      <CareersPage careers={careers} />
    </>
  );
}
