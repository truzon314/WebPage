import type { Metadata } from "next";
import Image from "next/image";
import mapPhoto from "@/public/images/placeholders/contact-map-photo.png";
import { PageHero } from "@/modules/content/PageHero";
import { ContactInfoCards } from "@/modules/leads/ContactInfoCards";
import { ContactForm } from "@/modules/leads/ContactForm";
import { Container } from "@/components/ui/Container";
import { getPage, getSettings } from "@/modules/content/api";
import { listCategories } from "@/modules/properties/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [contactPage, settings] = await Promise.all([
    getPage("contact").catch(() => null),
    getSettings().catch(() => null),
  ]);
  return buildMetadata({
    seo: contactPage?.seo,
    settings,
    path: "/contact",
    fallbackTitle: "Contact",
    fallbackDescription:
      "Book a site visit, request a callback, or ask us anything — our consultants respond within one business day.",
  });
}

export default async function ContactPage() {
  const [contactPage, settings, propertyTypes] = await Promise.all([
    getPage("contact").catch(() => null),
    getSettings().catch(() => undefined),
    listCategories("property").catch(() => []),
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
          <ContactForm
            heading={formBlock?.config.heading}
            description={formBlock?.config.description}
            types={propertyTypes.map((t) => t.name)}
          />
          <div className="relative h-[300px] w-full overflow-hidden rounded-[10px] lg:h-full lg:min-h-[420px]">
            <Image
              src={settings?.contact_map_image_url || mapPhoto}
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
