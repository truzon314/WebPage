import type { FooterLinkColumn, NavLink } from "@/types";

export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_COLUMNS: FooterLinkColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Careers", href: "/careers" },
      { label: "Investor Relations", href: "/investor-relations" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Properties",
    links: [
      { label: "All Projects", href: "/projects" },
      { label: "Compare Properties", href: "/compare" },
      { label: "Gallery", href: "/gallery" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Saved Properties", href: "/saved-properties" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "My Account", href: "/my-account" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "RERA Documentation", href: "#" },
    ],
  },
];

export const CONTACT_INFO = {
  address: "Truzon Towers, Floor 12, Jubilee Hills Road No. 36, Hyderabad, Telangana 500033",
  email: "info@truzonhomes.com",
  salesEmail: "sales@truzonhomes.com",
  phoneDisplay: "+919030010793",
  callbackPhoneDisplay: "+919030010793",
  callbackPhoneHref: "tel:+919030010793",
  whatsappHref: "https://wa.me/919030010793",
  workingHoursPrimary: "Mon – Sat: 9:30 AM – 7:30 PM",
  workingHoursSecondary: "Consultants on call 24/7",
};
