import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { CareersPage } from "@/modules/careers/CareersPage";
import { listCareers } from "@/modules/careers/api";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at Truzon Homes — join our team building architectural excellence across Hyderabad and Bangalore.",
};

export default async function Page() {
  const careers = await listCareers().catch(() => []);

  return (
    <>
      <PageHero
        title="Careers at Truzon Homes"
        subtitle="Join a team building architectural excellence across Hyderabad and Bangalore."
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />
      <CareersPage careers={careers} />
    </>
  );
}
