import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { LegalPageBody } from "@/modules/content/LegalPageBody";
import { CONTACT_INFO } from "@/lib/constants/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Truzon Homes collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    heading: "Introduction",
    paragraphs: [
      "Truzon Homes (\"we\", \"us\", \"our\") respects your privacy and is committed to protecting the personal information you share with us through this website, our enquiry forms, live chat, and phone or WhatsApp contact. This policy explains what we collect, why, and the choices you have.",
    ],
  },
  {
    heading: "Information We Collect",
    paragraphs: [
      "We collect information you provide directly — such as your name, phone number, email address, and message content — when you submit an enquiry form, request a callback, unlock a site layout, book a site visit, or start a live chat conversation.",
      "We also collect limited technical information automatically, such as your browser type, device type, and pages visited, to help us understand how the site is used and to keep it secure.",
    ],
  },
  {
    heading: "How We Use Your Information",
    paragraphs: [
      "We use the information you share to respond to enquiries, schedule site visits and callbacks, send requested brochures or availability details, and provide updates about properties you've expressed interest in.",
      "We do not use your personal information for any purpose beyond what it was collected for without your consent.",
    ],
  },
  {
    heading: "Cookies & Tracking Technologies",
    paragraphs: [
      "This site may use cookies and similar technologies to remember your preferences (such as saved properties) and to understand aggregate site usage through analytics tools. You can control or disable cookies through your browser settings, though some site features may not work as intended if you do.",
    ],
  },
  {
    heading: "How We Share Information",
    paragraphs: [
      "We do not sell your personal information. We may share it with trusted service providers who help us operate the site and respond to enquiries (such as messaging, hosting, or analytics providers), and only to the extent necessary for them to perform that work.",
      "We may also disclose information where required by law or to protect the rights, property, or safety of Truzon Homes, our customers, or others.",
    ],
  },
  {
    heading: "Data Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect the information you share with us from unauthorized access, alteration, or disclosure. No method of transmission or storage is completely secure, but we work to keep your data safe.",
    ],
  },
  {
    heading: "Your Rights & Choices",
    paragraphs: [
      "You may ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you about a specific enquiry, at any time by reaching out through the contact details below.",
    ],
  },
  {
    heading: "Children's Privacy",
    paragraphs: [
      "This website is not directed at children, and we do not knowingly collect personal information from anyone under the age of 18.",
    ],
  },
  {
    heading: "Changes to This Policy",
    paragraphs: [
      "We may update this policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The \"Last updated\" date at the top of this page reflects the most recent revision.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have questions about this policy or how your information is handled, contact us at ${CONTACT_INFO.email} or ${CONTACT_INFO.phoneDisplay}. Our registered office is at ${CONTACT_INFO.address}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <LegalPageBody lastUpdated="1 August 2026" sections={SECTIONS} />
    </>
  );
}
