import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { LegalPageBody } from "@/modules/content/LegalPageBody";
import { CONTACT_INFO } from "@/lib/constants/navigation";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Truzon Homes website.",
};

const SECTIONS = [
  {
    heading: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use this site.",
    ],
  },
  {
    heading: "Use of This Website",
    paragraphs: [
      "This website is provided to give you information about Truzon Homes' projects and services, and to let you make enquiries, save properties, and communicate with our team. You agree to use it only for lawful purposes and not to interfere with its normal operation.",
    ],
  },
  {
    heading: "Property Listings & Pricing",
    paragraphs: [
      "Property details, images, floor plans, pricing, and availability shown on this site are for general informational purposes and are subject to change without notice. Listings do not constitute a legal offer, and final terms are confirmed only through a formal booking agreement with Truzon Homes.",
      "Site layout maps and plot availability shown after unlocking a project are indicative and subject to confirmation at the time of booking.",
    ],
  },
  {
    heading: "Bookings, Payments & Cancellations",
    paragraphs: [
      "Any booking, payment plan, or cancellation is governed by the specific agreement you sign with Truzon Homes for that project, not by this website. Nothing on this site should be treated as a substitute for that agreement.",
    ],
  },
  {
    heading: "Intellectual Property",
    paragraphs: [
      "All content on this website — including text, images, logos, and design — is owned by or licensed to Truzon Homes and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use this content commercially without our written permission.",
    ],
  },
  {
    heading: "User Conduct",
    paragraphs: [
      "When submitting enquiries, chat messages, or other content through this site, you agree to provide accurate information and not to submit anything unlawful, misleading, or intended to disrupt the site or its users.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "Truzon Homes makes reasonable efforts to keep this site accurate and available, but does not guarantee it will be error-free or uninterrupted. To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of this website.",
    ],
  },
  {
    heading: "Indemnification",
    paragraphs: [
      "You agree to indemnify and hold Truzon Homes harmless from any claims or losses arising from your misuse of this website or violation of these terms.",
    ],
  },
  {
    heading: "Governing Law & Jurisdiction",
    paragraphs: [
      "These terms are governed by the laws of India, and any disputes arising from your use of this website are subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.",
    ],
  },
  {
    heading: "Changes to These Terms",
    paragraphs: [
      "We may revise these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms. The \"Last updated\" date above reflects the most recent revision.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `Questions about these terms can be sent to ${CONTACT_INFO.email} or ${CONTACT_INFO.phoneDisplay}. Our registered office is at ${CONTACT_INFO.address}.`,
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        title="Terms of Service"
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
      />
      <LegalPageBody lastUpdated="1 August 2026" sections={SECTIONS} />
    </>
  );
}
