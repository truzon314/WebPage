import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
}

/** Navy banner used at the top of inner pages (About, Projects, Blog, …), below the fixed header. */
export function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="bg-navy-950 pb-16 pt-[150px] text-center">
      <Container size="narrow">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-1.5 text-xs text-[#9aa4c0]">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight size={12} /> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gold-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gold-300">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mb-3 font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mx-auto max-w-xl text-[15px] leading-[1.7] text-[#b9c1d6]">{subtitle}</p> : null}
      </Container>
    </section>
  );
}
