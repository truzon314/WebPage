import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { FAQ } from "@/modules/content/FAQ";
import { CTA } from "@/modules/content/CTA";
import { FAQS } from "@/modules/content/constants/faqs";
import { getPage, getSettings } from "@/modules/content/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

const SITE_URL = "https://www.truzonhomes.com";

export async function generateMetadata(): Promise<Metadata> {
  const [faqsPage, settings] = await Promise.all([
    getPage("faqs").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: faqsPage?.seo,
    settings,
    path: "/faqs",
    fallbackTitle: "Frequently Asked Questions",
    fallbackDescription:
      "Answers to common questions about booking site visits, RERA approvals, interiors, payment plans, and home loans at Truzon Homes.",
  });
}

export default async function FaqsPage() {
  const faqBlock = await getPage("faqs").then((p) => p?.blocks.find((b) => b.type === "faq")).catch(() => null);
  const items = (faqBlock?.config as { items?: typeof FAQS })?.items || FAQS;

  const faqSchemaItems = items.map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", url: "/" },
            { name: "FAQs", url: "/faqs" },
          ],
          SITE_URL
        )}
      />
      {faqSchemaItems.length > 0 && <JsonLd data={faqJsonLd(faqSchemaItems)!} />}
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Answers to the questions we hear most from prospective buyers and investors."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />
      <FAQ heading="Common Questions" items={items} />
      <CTA
        title="Still have a question?"
        description="Our property consultants are happy to walk you through anything not covered here."
        primaryLabel="REQUEST A CALLBACK"
        primaryHref="/contact"
      />
    </>
  );
}
