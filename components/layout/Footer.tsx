import Image from "next/image";
import Link from "next/link";
import logoFooter from "@/public/images/extracted/logo-footer.png";
import { Container } from "@/components/ui/Container";
import type { CmsSettings } from "@/lib/cms";
import type { FooterLinkColumn } from "@/types";

const SOCIAL_ICONS = [
  {
    label: "Facebook",
    path: "M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.9V11H8v3h2v7h3v-7h2.4l.4-3H13v-1.1c0-.6.4-.9 1-.9z",
  },
];

export function Footer({
  footerColumns,
  settings,
}: {
  footerColumns: FooterLinkColumn[];
  settings: CmsSettings;
}) {
  return (
    <footer className="bg-[linear-gradient(315deg,#080d1a_0%,#1f3a5f_100%)] px-6 pt-16 sm:px-10 lg:px-[60px] lg:pt-[70px]">
      <Container padded={false}>
        <div className="flex flex-col gap-12 border-b border-[#1d2740] pb-12 lg:flex-row lg:gap-16 lg:pb-[50px]">
          <div className="lg:w-[260px] lg:shrink-0">
            <div className="mb-[18px] flex items-center">
              <Image src={logoFooter} alt="Truzon Homes" className="h-[130px] w-auto" />
            </div>
            <p className="mb-5 max-w-[250px] text-[13px] leading-[1.8] text-white">
              Architectural Excellence Defined. Redefining luxury living through architectural precision and
              ethical excellence.
            </p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.label}
                  href={settings.social_facebook_url ?? "#"}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3d5a8a] transition-colors hover:bg-[#4f739f]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c7cedb" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
              <a
                href={settings.social_instagram_url ?? "#"}
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3d5a8a] transition-colors hover:bg-[#4f739f]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c7cedb" strokeWidth={1.8} aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17.2" cy="6.8" r="0.6" fill="#c7cedb" />
                </svg>
              </a>
              <a
                href={settings.social_youtube_url ?? "#"}
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3d5a8a] transition-colors hover:bg-[#4f739f]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c7cedb" aria-hidden="true">
                  <path d="M10 15l5.2-3L10 9v6z" />
                  <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6C2.2 14 2.4 15.7 2.4 15.7s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7.1.2 7.1.2s3.9 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-1.6c0-1.7-.2-3.4-.2-3.4z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex-1 lg:grid-cols-5 lg:gap-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <div className="mb-5 inline-block border-b-2 border-gold-400 pb-2.5 text-xs font-bold tracking-[0.8px] text-white">
                  {column.title.toUpperCase()}
                </div>
                <div className="flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[13.5px] text-[#c3cbde] transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-5 inline-block border-b-2 border-gold-400 pb-2.5 text-xs font-bold tracking-[0.8px] text-white">
                GET IN TOUCH
              </div>
              <div className="flex flex-col gap-3 text-[13.5px] leading-[1.7] text-[#c3cbde]">
                <p>{settings.contact_address}</p>
                <p>{settings.contact_email}</p>
                <p>{settings.contact_phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 py-6 text-xs text-[#d7dcec]">
          <div>© 2026 Truzon Homes. Architectural Excellence Defined. Understated Luxury.</div>
          <div className="flex gap-[22px]">
            <Link href="/privacy-policy" className="text-xs text-[#d7dcec] hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-[#d7dcec] hover:text-gold-300">
              Terms of Service
            </Link>
            <a href="#" className="text-xs text-[#d7dcec] hover:text-gold-300">
              RERA Documentation
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
