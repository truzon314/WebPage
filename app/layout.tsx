import type { Metadata, Viewport } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LiveChatWidget } from "@/modules/chat/LiveChatWidget";
import { FavoritesProvider } from "@/modules/properties/FavoritesContext";
import { FloatingWidgetsProvider } from "@/modules/layout/FloatingWidgetsContext";
import { getMenu, getSettings, type CmsSettings } from "@/modules/content/api";
import { toFooterColumn, toNavLinks, toWhatsAppHref } from "@/modules/content/mappers";
import { MAIN_NAV } from "@/lib/constants/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { CMS_URL } from "@/lib/cms-client";
import type { FooterLinkColumn } from "@/types";
import "./globals.css";

const SITE_URL = "https://www.truzonhomes.com";

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

const FALLBACK_TITLE = "Truzon Homes | Architectural Excellence Defined";
const FALLBACK_DESCRIPTION =
  "Truzon Homes builds premium villas, apartments, plots and farm lands across Hyderabad and Bangalore — DTCP & RERA approved, 15+ years of architectural excellence.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const title = settings?.default_meta_title || FALLBACK_TITLE;
  const description = settings?.default_meta_description || FALLBACK_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings?.site_name || "Truzon Homes"}`,
    },
    description,
    keywords: settings?.default_keywords ?? [
      "Truzon Homes",
      "luxury villas Hyderabad",
      "RERA approved projects",
      "premium apartments Bangalore",
      "real estate investment India",
    ],
    icons: {
      icon: settings?.favicon_url || "/images/extracted/favicon.png",
    },
    openGraph: {
      title,
      description,
      siteName: settings?.site_name || "Truzon Homes",
      type: "website",
      images: settings?.og_default_image_url ? [settings.og_default_image_url] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0f1c3a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      <head>
        {/* Every page fetches from the CMS server-side, and the chat widget
            polls it client-side — warming the connection ahead of time
            shaves a DNS+TLS round trip off both. */}
        <link rel="preconnect" href={CMS_URL} />
        <link rel="dns-prefetch" href={CMS_URL} />
      </head>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <JsonLd data={organizationJsonLd(settings ?? DEFAULT_SETTINGS, SITE_URL)} />
        <JsonLd data={localBusinessJsonLd(settings ?? DEFAULT_SETTINGS, SITE_URL)} />
        <JsonLd data={websiteJsonLd(settings ?? DEFAULT_SETTINGS, SITE_URL)} />
        <FavoritesProvider>
          <FloatingWidgetsProvider>
            <Header mainNav={mainNav} logoUrl={(settings ?? DEFAULT_SETTINGS).logo_url} />
            <main className="flex-1">{children}</main>
            <Footer footerColumns={footerColumns} settings={settings ?? DEFAULT_SETTINGS} />
            <WhatsAppButton whatsappHref={toWhatsAppHref((settings ?? DEFAULT_SETTINGS).whatsapp_number)} />
            <LiveChatWidget />
          </FloatingWidgetsProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

const DEFAULT_SETTINGS: CmsSettings = {
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
  default_meta_title: null,
  default_meta_description: null,
  default_keywords: null,
  default_canonical_url: null,
  organization_name: null,
  google_verification_code: null,
  bing_verification_code: null,
  google_tag_manager_id: null,
  meta_pixel_id: null,
  google_search_console_verification: null,
  og_default_image_url: null,
  twitter_card_default_type: null,
  working_hours: null,
  latitude: null,
  longitude: null,
  service_areas: null,
  why_choose_image_url: null,
  contact_map_image_url: null,
};
