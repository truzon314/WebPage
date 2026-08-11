# SEO Module

A dedicated dashboard for the site's search-engine visibility, separate from the per-page SEO panels described in the other guides. It has 10 tabs across the top.

## SEO Audit & Health

An automatic scan of the whole site — a health score out of 100, how many pages/images were scanned, and specifically which pages are missing a meta description or which images are missing alt text. Use this as a checklist of things to go fix. **Export Audit Report** downloads the full findings as a file.

## PageSpeed & Vitals

Runs a real Google PageSpeed/Lighthouse check on any URL and shows Performance, Accessibility, Best Practices, and SEO scores plus Core Web Vitals. **Needs a free Google PageSpeed API key** set up first (under the Global Settings tab, below) — until then it shows "Not connected."

## Search Rankings

Shows real click/impression/position data from Google Search Console for search terms the site ranks for. **Needs a Google Search Console connection** (also set up under Global Settings) — this one requires a bit of Google Cloud setup, with instructions shown right there in the tab when it's not yet connected.

## Autocomplete Monitor

Type a keyword (e.g. "truzon homes") and see what Google's autocomplete currently suggests for it — useful for understanding what people search alongside your brand/properties. Works immediately, no setup needed.

## Backlinks

Shows sites linking to truzonhomes.com, via Ahrefs. **Needs a paid Ahrefs API key** under Global Settings — this is the only tab here that requires a paid third-party service.

## Global Settings

Site-wide SEO defaults and integrations, in one place:
- Organization name, default meta title/description (used as a fallback anywhere a page hasn't set its own).
- Search engine verification codes (Google, Bing) — proves to search engines that you own the site.
- Analytics IDs — Google Analytics (GA4), Google Tag Manager, Meta/Facebook Pixel.
- Default social share image and Twitter card type.
- The site's `robots.txt` content — controls what search engine crawlers are allowed to access.
- The API keys mentioned above (PageSpeed, Search Console, Ahrefs) — each is optional and only unlocks its matching tab.

## Local SEO

Business details that power Google's "local business" rich results — working hours, service areas (e.g. "Hyderabad, Banjara Hills, Gachibowli"), and exact latitude/longitude coordinates. A live preview of the generated structured data is shown at the bottom.

## Redirects (301/302)

If a page's URL changes or an old page is removed, add a redirect here so old links (and Google's existing index of them) still land somewhere valid instead of a dead 404. Enter the old path, the new path, and whether it's permanent (301, the usual choice) or temporary (302). The table shows how many times each redirect has actually been hit.

## AI Assistant

Generates SEO copy on demand — meta titles, meta descriptions, keyword suggestions, image alt text, property descriptions, or FAQ content. Pick what you need, describe the topic, and it drafts a suggestion you can copy into the relevant field elsewhere.

## JSON-LD Schemas

A read-only technical view of the structured data markup sent to Google and AI search crawlers (Organization info, Website info). Nothing to edit here — it's generated automatically from your Settings and Local SEO info, shown for reference/troubleshooting.
