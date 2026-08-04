import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ValueCard } from "@/modules/content/ValueCard";
import { Button } from "@/components/ui/Button";
import { IN_HOUSE_BUILD, VALUES } from "@/modules/content/constants/about";

export function AboutValues() {
  return (
    <section className="bg-surface-muted py-16 lg:py-[90px]">
      <Container>
        <SectionHeading
          align="center"
          title="What We Stand For"
          subtitle="The principles behind every Truzon address"
          className="mb-12"
        />
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-6 rounded-[10px] bg-surface p-8 shadow-[0_2px_10px_rgba(18,23,43,0.05)] sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 font-heading text-lg font-bold text-navy-900">{IN_HOUSE_BUILD.title}</div>
            <p className="max-w-xl text-[13.5px] leading-[1.6] text-text-body">{IN_HOUSE_BUILD.description}</p>
          </div>
          <Button href={IN_HOUSE_BUILD.ctaHref} variant="dark" className="sm:whitespace-nowrap">
            {IN_HOUSE_BUILD.ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
