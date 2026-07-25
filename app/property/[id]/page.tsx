import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { getProperty } from "@/lib/cms";
import { toProperty } from "@/lib/cms-mappers";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id).catch(() => null);
  return { title: property ? property.name : "Property Not Found" };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cmsProperty = await getProperty(id).catch(() => null);
  if (!cmsProperty) notFound();
  const property = toProperty(cmsProperty);

  return (
    <>
      <PageHero
        title={property.name}
        subtitle={property.location}
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: property.name }]}
      />
      <article className="py-16">
        <Container size="narrow">
          <div className="relative mb-8 h-[320px] w-full overflow-hidden rounded-[10px] sm:h-[420px]">
            <Image src={property.image} alt={property.name} fill sizes="(min-width: 820px) 820px, 100vw" className="object-cover" priority />
          </div>
          <div className="mb-8 flex flex-wrap gap-6 border-y border-divider py-5 text-sm text-text-strong">
            <span>{property.specA}</span>
            <span>{property.specB}</span>
            <span className="font-heading text-lg font-bold text-navy-900">{property.price}</span>
          </div>
          <p className="mb-8 text-[15px] leading-[1.8] text-text-body">
            Full brochure details, floor plans, and a virtual walkthrough for {property.name} are coming soon. In the
            meantime, request a callback and one of our property consultants will share everything you need.
          </p>
          <Button href="/contact" variant="gold">
            Request a Callback
          </Button>
        </Container>
      </article>
    </>
  );
}
