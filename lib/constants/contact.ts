import { CONTACT_INFO } from "@/lib/constants/navigation";
import type { ContactCard, GetInTouchItem } from "@/types";

export const CONTACT_CARDS: ContactCard[] = [
  { icon: "office", title: "Corporate Office", lines: [CONTACT_INFO.address] },
  {
    icon: "phone",
    title: "Call Us",
    lines: [CONTACT_INFO.phoneDisplay, `${CONTACT_INFO.callbackPhoneDisplay} (WhatsApp)`],
  },
  { icon: "email", title: "Email Us", lines: [CONTACT_INFO.email, CONTACT_INFO.salesEmail] },
  {
    icon: "clock",
    title: "Working Hours",
    lines: [CONTACT_INFO.workingHoursPrimary, CONTACT_INFO.workingHoursSecondary],
  },
];

export const GET_IN_TOUCH_ITEMS: GetInTouchItem[] = [
  {
    icon: "calendar",
    title: "Book a Site Visit",
    description: "Schedule an in-person tour",
    href: "/contact#request-callback",
  },
  {
    icon: "search",
    title: "Track Enquiry",
    description: "Check status on a past enquiry",
    href: "/track-enquiry",
  },
  {
    icon: "lifebuoy",
    title: "Support Request",
    description: "Get help with an existing order",
    href: "/support",
  },
];
