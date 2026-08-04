import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { FAQ } from "@/modules/content/FAQ";
import { CTA } from "@/modules/content/CTA";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about booking, RERA approvals, interiors, payment plans, and home loans at Truzon Homes.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Answers to the questions we hear most from prospective buyers and investors."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />
      <FAQ heading="Common Questions" />
      <CTA
        title="Still have a question?"
        description="Our property consultants are happy to walk you through anything not covered here."
        primaryLabel="REQUEST A CALLBACK"
        primaryHref="/contact"
      />
    </>
  );
}
