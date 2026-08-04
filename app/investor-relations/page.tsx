import type { Metadata } from "next";
import { PageHero } from "@/modules/content/PageHero";
import { Stats } from "@/modules/content/Stats";
import { Certifications } from "@/modules/content/Certifications";
import { CTA } from "@/modules/content/CTA";
import { Container } from "@/components/ui/Container";
import { CONTACT_INFO } from "@/lib/constants/navigation";

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "An overview of Truzon Homes' growth, governance, and track record for investors and financial partners, plus how to get in touch with our investor relations team.",
};

export default function InvestorRelationsPage() {
  return (
    <>
      <PageHero
        title="Investor Relations"
        subtitle="Building long-term value through disciplined development, transparent governance, and a consistent track record."
        crumbs={[{ label: "Home", href: "/" }, { label: "Investor Relations" }]}
      />

      <section className="py-16 lg:py-[70px]">
        <Container size="narrow">
          <h2 className="mb-5 font-heading text-2xl font-bold text-navy-900 sm:text-[28px]">Company Overview</h2>
          <p className="mb-4 text-[15px] leading-[1.8] text-text-body">
            Truzon Homes has spent over 15 years developing residential communities across Hyderabad and Bangalore —
            from DTCP & RERA-approved plotted layouts to gated villa communities and premium apartment complexes.
            Our growth has been built on disciplined land selection, on-time delivery, and long-term relationships
            with the families and partners who invest with us.
          </p>
          <p className="text-[15px] leading-[1.8] text-text-body">
            We work with a network of financial institutions, landowners, and channel partners, and welcome
            enquiries from investors interested in our current and upcoming developments.
          </p>
        </Container>
      </section>

      <Stats />

      <section className="py-16 lg:py-[70px]">
        <Container size="narrow">
          <h2 className="mb-5 font-heading text-2xl font-bold text-navy-900 sm:text-[28px]">Governance & Compliance</h2>
          <p className="mb-4 text-[15px] leading-[1.8] text-text-body">
            Every Truzon Homes project carries DTCP approval and a valid RERA registration, filed and tracked before
            marketing or sales begin. Our finance and legal teams maintain project-level compliance records that are
            made available to investors and financial partners on request.
          </p>
          <p className="text-[15px] leading-[1.8] text-text-body">
            We follow standard construction-linked and milestone-based disbursement schedules for institutional
            funding, with independent quantity surveyor sign-off at each stage.
          </p>
        </Container>
      </section>

      <Certifications />

      <section className="py-16 lg:py-[70px]">
        <Container size="narrow" className="text-center">
          <h2 className="mb-3 font-heading text-2xl font-bold text-navy-900 sm:text-[28px]">Investor Enquiries</h2>
          <p className="mx-auto mb-6 max-w-lg text-[15px] leading-[1.7] text-text-body">
            For financing partnerships, land collaborations, or institutional investment enquiries, reach our
            investor relations desk directly.
          </p>
          <div className="flex flex-col items-center gap-1.5 text-[14.5px] font-semibold text-navy-900">
            <a href={`mailto:${CONTACT_INFO.salesEmail}`} className="hover:text-gold-500">
              {CONTACT_INFO.salesEmail}
            </a>
            <a href={CONTACT_INFO.callbackPhoneHref} className="hover:text-gold-500">
              {CONTACT_INFO.callbackPhoneDisplay}
            </a>
          </div>
        </Container>
      </section>

      <CTA
        title="Explore our current portfolio"
        description="See the projects underway and delivered across Hyderabad and Bangalore."
        primaryLabel="VIEW OUR PROJECTS"
        primaryHref="/projects"
        showPhoneLink={false}
      />
    </>
  );
}
