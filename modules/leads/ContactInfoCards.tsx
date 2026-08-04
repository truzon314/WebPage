import { Container } from "@/components/ui/Container";
import { InfoCard } from "@/modules/leads/InfoCard";
import { CONTACT_CARDS } from "@/modules/leads/constants";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import type { CmsSettings } from "@/modules/content/api";
import type { ContactCard } from "@/modules/leads/types";

export function ContactInfoCards({ settings }: { settings?: CmsSettings }) {
  const cards: ContactCard[] = settings
    ? [
        { icon: "office", title: "Corporate Office", lines: [settings.contact_address ?? CONTACT_INFO.address] },
        {
          icon: "phone",
          title: "Call Us",
          lines: [
            settings.contact_phone ?? CONTACT_INFO.phoneDisplay,
            `${settings.callback_phone ?? CONTACT_INFO.callbackPhoneDisplay} (WhatsApp)`,
          ],
        },
        {
          icon: "email",
          title: "Email Us",
          lines: [settings.contact_email ?? CONTACT_INFO.email, CONTACT_INFO.salesEmail],
        },
        {
          icon: "clock",
          title: "Working Hours",
          lines: [CONTACT_INFO.workingHoursPrimary, CONTACT_INFO.workingHoursSecondary],
        },
      ]
    : CONTACT_CARDS;

  return (
    <section className="py-16 lg:pt-[70px]">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
