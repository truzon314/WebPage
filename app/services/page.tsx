import type { Metadata } from "next";
import { Building2, Hammer, Home, Landmark, PaintRoller, Wrench, type LucideIcon } from "lucide-react";
import { PageHero } from "@/modules/content/PageHero";
import { CTA } from "@/modules/content/CTA";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Services",
  description:
    "From land acquisition and DTCP/RERA-approved development to turnkey interiors and after-sales care — explore the services Truzon Homes offers across every stage of building a home.",
};

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Landmark,
    title: "Land Acquisition & Approvals",
    description:
      "We identify, evaluate, and secure prime land parcels, then take every project through DTCP and RERA approvals before a single brick is laid.",
  },
  {
    icon: Building2,
    title: "Villa & Apartment Construction",
    description:
      "End-to-end construction of villas, gated communities, and apartment complexes — engineered for structural integrity and finished to a premium standard.",
  },
  {
    icon: Home,
    title: "Plotted Developments",
    description:
      "Fully developed residential plots with wide roads, underground utilities, avenue plantation, and gated security — ready to build on from day one.",
  },
  {
    icon: PaintRoller,
    title: "Interior Design & Turnkey Fit-outs",
    description:
      "Our in-house design studio delivers curated interior packages, from material and finish selection to complete turnkey handover.",
  },
  {
    icon: Wrench,
    title: "Project Management & Compliance",
    description:
      "Dedicated project managers oversee timelines, quality checks, and regulatory compliance so every milestone is met without surprises.",
  },
  {
    icon: Hammer,
    title: "After-Sales & Facility Management",
    description:
      "Our relationship continues after handover — with maintenance support, facility management, and a responsive after-sales team.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Everything it takes to turn a plot of land into a home you're proud of — handled end to end, under one roof."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="py-16 lg:py-[90px]">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-[10px] border border-divider bg-surface p-7 shadow-[0_2px_18px_rgba(18,23,43,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(18,23,43,0.1)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-gold-400">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <h2 className="mb-2.5 font-heading text-lg font-bold text-navy-900">{service.title}</h2>
                  <p className="text-[13.5px] leading-[1.7] text-text-body">{service.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CTA
        title="Ready to start building?"
        description="Talk to a Truzon Homes consultant about which service fits your project, from a single plot to a full gated community."
        primaryLabel="REQUEST A CALLBACK"
        primaryHref="/contact"
      />
    </>
  );
}
