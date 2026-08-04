import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-104px)] items-center py-24">
      <Container size="narrow" className="text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <Compass size={28} strokeWidth={1.6} className="text-gold-500" />
        </div>

        <div className="mb-2 font-heading text-[88px] font-bold leading-none text-navy-900 sm:text-[120px]">
          404
        </div>

        <h1 className="mb-3 font-heading text-2xl font-bold text-navy-900 sm:text-[28px]">
          This page has wandered off the map.
        </h1>
        <p className="mx-auto mb-10 max-w-[440px] text-[15px] leading-[1.7] text-text-body">
          The page you&apos;re looking for doesn&apos;t exist, may have moved, or the address was mistyped.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="gold">
            BACK TO HOME
          </Button>
          <Button href="/projects" variant="outline-dark">
            EXPLORE PROJECTS
          </Button>
        </div>
      </Container>
    </section>
  );
}
