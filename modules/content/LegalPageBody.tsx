import { Container } from "@/components/ui/Container";

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/** Shared prose shell for Privacy Policy / Terms of Service — identical
 * layout, only the section content differs between the two pages. */
export function LegalPageBody({ lastUpdated, sections }: { lastUpdated: string; sections: LegalSection[] }) {
  return (
    <section className="py-16 lg:py-[90px]">
      <Container size="narrow">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.8px] text-text-muted">
          Last updated: {lastUpdated}
        </p>
        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <div key={section.heading}>
              <h2 className="mb-3 font-heading text-xl font-bold text-navy-900">
                {i + 1}. {section.heading}
              </h2>
              <div className="flex flex-col gap-3">
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j} className="text-[14.5px] leading-[1.8] text-text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
