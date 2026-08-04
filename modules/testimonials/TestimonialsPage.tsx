import Image from "next/image";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Testimonial } from "@/modules/testimonials/types";

export function TestimonialsPage({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <Container className="py-20 text-center">
        <p className="text-[15px] text-text-body">The full collection of resident stories is coming soon.</p>
      </Container>
    );
  }

  return (
    <Container className="py-16 lg:py-[90px]">
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="flex flex-col rounded-xl bg-surface-muted p-7 shadow-[0_2px_10px_rgba(18,23,43,0.05)]">
            {t.rating ? (
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating! ? "fill-gold-400 text-gold-400" : "text-border"}
                  />
                ))}
              </div>
            ) : null}
            <p className="mb-5 flex-1 text-[15px] italic leading-[1.7] text-text-quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              {t.photoUrl ? (
                <Image src={t.photoUrl} alt={t.name} width={48} height={48} className="rounded-full object-cover" />
              ) : null}
              <div>
                <div className="text-sm font-bold text-navy-900">{t.name}</div>
                {t.roleOrLocation ? <div className="text-xs text-text-muted">{t.roleOrLocation}</div> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
