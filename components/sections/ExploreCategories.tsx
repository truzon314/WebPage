import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconTile } from "@/components/ui/IconTile";
import { CATEGORIES } from "@/lib/constants/categories";

export function ExploreCategories() {
  return (
    <section className="bg-surface-muted py-20">
      <Container>
        <SectionHeading
          align="center"
          title="Explore by Category"
          subtitle="Tailored property solutions for every aspiration"
          className="mb-12"
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <IconTile key={category.label} {...category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
