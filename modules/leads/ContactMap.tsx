"use client";

/**
 * ContactMap
 * ----------
 * Renders a live Google Maps embed for the Truzon Homes Miyapur office.
 *
 * Uses the Maps Embed API (<iframe>) — the lightest-weight option:
 *   • No JS SDK, no @react-google-maps/api
 *   • Works with a free Maps Embed API key (or the same general Maps API key)
 *   • Env var: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 *
 * Fallback: if the key is not set the component shows a styled card with the
 * address and a direct "Open in Maps" link so the page is never broken.
 */

const OFFICE_LABEL = "Truzon Homes – Miyapur, Hyderabad";
const OFFICE_QUERY = "Truzon+Homes,Miyapur,Hyderabad,Telangana,India";
const OFFICE_ADDRESS = "Miyapur, Hyderabad, Telangana 500049";
const MAPS_OPEN_URL =
  "https://www.google.com/maps/search/Truzon+Homes,+Miyapur,+Hyderabad";

export function ContactMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${OFFICE_QUERY}&zoom=16`
    : // Free embed fallback — no API key needed, uses place search iframe URL
      `https://maps.google.com/maps?q=${OFFICE_QUERY}&t=m&z=16&output=embed&iwloc=near`;

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[10px] lg:h-full lg:min-h-[420px]">
      <iframe
        src={embedSrc}
        title={OFFICE_LABEL}
        aria-label={OFFICE_LABEL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />

      {/* Branding badge shown over the map */}
      <a
        href={MAPS_OPEN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
        aria-label="Open Truzon Homes location in Google Maps"
      >
        {/* Map pin icon (inline SVG — no extra dependency) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div>
          <p className="text-[11px] font-semibold leading-tight text-neutral-900">
            Truzon Homes
          </p>
          <p className="text-[10px] leading-tight text-neutral-500">
            {OFFICE_ADDRESS}
          </p>
        </div>
      </a>
    </div>
  );
}
