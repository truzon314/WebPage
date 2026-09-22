import { Container } from "@/components/ui/Container";
import { InfoCard } from "@/modules/leads/InfoCard";
import { CONTACT_CARDS } from "@/modules/leads/constants";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import type { CmsSettings } from "@/modules/content/api";
import type { ContactCard } from "@/modules/leads/types";

export function ContactInfoCards({ settings }: { settings?: CmsSettings }) {
  const primaryPhone = settings?.contact_phone || CONTACT_INFO.phoneDisplay;
  const secondaryPhone = settings?.callback_phone || primaryPhone;
  const primaryEmail = settings?.contact_email || CONTACT_INFO.email;
  const address = settings?.contact_address || CONTACT_INFO.address;

  const cards: ContactCard[] = [
    { icon: "office", title: "Corporate Office", lines: [address] },
    {
      icon: "phone",
      title: "Call Us",
      lines: [
        primaryPhone,
        `${secondaryPhone} (WhatsApp)`,
      ],
    },
    {
      icon: "email",
      title: "Email Us",
      lines: [primaryEmail, CONTACT_INFO.salesEmail],
    },
    {
      icon: "clock",
      title: "Working Hours",
      lines: [CONTACT_INFO.workingHoursPrimary, CONTACT_INFO.workingHoursSecondary],
    },
  ];

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
