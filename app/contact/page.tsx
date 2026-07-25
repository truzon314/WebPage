import type { Metadata } from "next";
import Image from "next/image";
import mapPhoto from "@/public/images/placeholders/contact-map-photo.png";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfoCards } from "@/components/sections/ContactInfoCards";
import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Container";
import { getPage, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a site visit, request a callback, or ask us anything — our consultants respond within one business day.",
};

export default async function ContactPage() {
  const [contactPage, settings] = await Promise.all([
    getPage("contact").catch(() => null),
    getSettings().catch(() => undefined),
  ]);
  const formBlock = contactPage?.blocks.find((b) => b.type === "contact_form");

  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Book a site visit, request a callback, or ask us anything — our consultants respond within one business day."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <ContactInfoCards settings={settings} />
      <section className="pb-16 lg:pb-[90px]">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <ContactForm heading={formBlock?.config.heading} description={formBlock?.config.description} />
          <div className="relative h-[300px] w-full overflow-hidden rounded-[10px] lg:h-full lg:min-h-[420px]">
            <Image
              src={mapPhoto}
              alt="Truzon Homes corporate office location"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
