import { Award, BadgeCheck, FileCheck2, ShieldCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CERTIFICATIONS } from "@/modules/content/constants/about";
import type { Certification } from "@/modules/content/types";

const ICONS: Record<Certification["icon"], LucideIcon> = {
  dtcp: ShieldCheck,
  rera: FileCheck2,
  igbc: BadgeCheck,
  iso: Award,
};

export function Certifications() {
  return (
    <section className="py-16 lg:py-[90px]">
      <Container size="narrow" className="text-center">
        <h2 className="mb-10 font-heading text-[26px] font-bold text-navy-900 sm:text-[30px]">
          Approvals &amp; Certifications
        </h2>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {CERTIFICATIONS.map((cert) => {
            const Icon = ICONS[cert.icon];
            return (
              <div key={cert.label} className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-gold-400">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <span className="text-[12.5px] font-semibold text-navy-900">{cert.label}</span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
