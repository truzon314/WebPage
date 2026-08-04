import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/constants/navigation";

interface CTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  /** Set false to hide the phone-number link (e.g. on pages with a single, focused action). */
  showPhoneLink?: boolean;
  phoneDisplay?: string;
  phoneHref?: string;
}

export function CTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  showPhoneLink = true,
  phoneDisplay,
  phoneHref,
}: CTAProps) {
  return (
    <Container className="my-16 lg:my-[70px]">
      <div className="rounded-[14px] bg-navy-950 px-8 py-14 text-center sm:px-16 lg:px-[60px] lg:py-16">
        <h2 className="mb-3.5 font-heading text-2xl font-bold text-white sm:text-[30px]">{title}</h2>
        <p className="mx-auto mb-8 max-w-[520px] text-[15px] leading-[1.7] text-[#b9c1d6]">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-7">
          <Button href={primaryHref} variant="gold">
            {primaryLabel}
          </Button>
          {showPhoneLink ? (
            <a
              href={phoneHref ?? CONTACT_INFO.callbackPhoneHref}
              className="flex items-center gap-2 text-[14.5px] font-semibold text-white"
            >
              <Phone size={16} />
              {phoneDisplay ?? CONTACT_INFO.callbackPhoneDisplay}
            </a>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
