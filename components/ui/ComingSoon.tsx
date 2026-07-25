import { Construction } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Shared placeholder for routes referenced by the nav/footer that weren't
 * part of the Home page bundle we reverse-engineered. Keeps every internal
 * link resolving to a real, on-brand page instead of a 404 while those
 * pages are built out.
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="flex min-h-[60vh] items-center py-28">
      <Container size="narrow" className="text-center">
        <Construction size={40} strokeWidth={1.6} className="mx-auto mb-6 text-gold-400" />
        <h1 className="mb-4 font-heading text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h1>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-[1.7] text-text-body">
          {description ?? "This page is being crafted with the same care as the rest of Truzon Homes. Check back soon."}
        </p>
        <Button href="/" variant="gold">
          Back to Home
        </Button>
      </Container>
    </section>
  );
}
