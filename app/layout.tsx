import type { Metadata, Viewport } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LiveChatWidget } from "@/components/layout/LiveChatWidget";
import { CompareProvider } from "@/lib/context/CompareContext";
import { getMenu, getSettings } from "@/lib/cms";
import { toFooterColumn, toNavLinks, toWhatsAppHref } from "@/lib/cms-mappers";
import { MAIN_NAV } from "@/lib/constants/navigation";
import type { FooterLinkColumn } from "@/types";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.truzonhomes.com"),
  title: {
    default: "Truzon Homes | Architectural Excellence Defined",
    template: "%s | Truzon Homes",
  },
  description:
    "Truzon Homes builds premium villas, apartments, plots and farm lands across Hyderabad and Bangalore — DTCP & RERA approved, 15+ years of architectural excellence.",
  keywords: [
    "Truzon Homes",
    "luxury villas Hyderabad",
    "RERA approved projects",
    "premium apartments Bangalore",
    "real estate investment India",
  ],
  icons: {
    icon: "/images/extracted/favicon.png",
  },
  openGraph: {
    title: "Truzon Homes | Architectural Excellence Defined",
    description:
      "Discover architectural masterpieces and premium investment opportunities with Truzon Homes — understated luxury, 15+ years in the making.",
    siteName: "Truzon Homes",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1c3a",
  width: "device-width",
  initialScale: 1,
};

async function getNavData() {
  try {
    const [headerMenu, footerCompany, footerProperties, footerResources, footerLegal, settings] = await Promise.all([
      getMenu("header"),
      getMenu("footer_company"),
      getMenu("footer_properties"),
      getMenu("footer_resources"),
      getMenu("footer_legal"),
      getSettings(),
    ]);
    return {
      mainNav: headerMenu ? toNavLinks(headerMenu.items) : MAIN_NAV,
      footerColumns: [
        footerCompany && toFooterColumn("Company", footerCompany.items),
        footerProperties && toFooterColumn("Properties", footerProperties.items),
        footerResources && toFooterColumn("Resources", footerResources.items),
        footerLegal && toFooterColumn("Legal", footerLegal.items),
      ].filter((c): c is FooterLinkColumn => c !== null),
      settings,
    };
  } catch {
    // CMS unreachable — degrade to the site's own static nav rather than crashing.
    return {
      mainNav: MAIN_NAV,
      footerColumns: [] as FooterLinkColumn[],
      settings: await getSettings().catch(() => null),
    };
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { mainNav, footerColumns, settings } = await getNavData();

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${workSans.variable}`}>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <CompareProvider>
          <Header mainNav={mainNav} />
          <main className="flex-1">{children}</main>
          <Footer footerColumns={footerColumns} settings={settings ?? DEFAULT_SETTINGS} />
          <WhatsAppButton whatsappHref={toWhatsAppHref((settings ?? DEFAULT_SETTINGS).whatsapp_number)} />
          <LiveChatWidget />
        </CompareProvider>
      </body>
    </html>
  );
}

const DEFAULT_SETTINGS = {
  site_name: null,
  logo_url: null,
  favicon_url: null,
  contact_email: null,
  contact_phone: null,
  callback_phone: null,
  whatsapp_number: null,
  contact_address: null,
  social_facebook_url: null,
  social_instagram_url: null,
  social_linkedin_url: null,
  social_youtube_url: null,
  analytics_ga_measurement_id: null,
};
