# Truzon Homes — Public Website

The public marketing site for Truzon Homes. Started as a reverse-engineered rebuild of a bundled
HTML export (see "Origin" below), then wired up to a companion CMS so an admin can manage real
content — navigation, site settings, the Home page's hero/FAQ/CTA, properties, blog posts, and
both lead-capture forms — without touching code.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first `@theme` configuration)
- **Framer Motion** for animation
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

Set `NEXT_PUBLIC_CMS_URL` in `.env.local` (defaults to `http://localhost:8000`) to point at the
CMS backend. Every CMS-backed page degrades to sensible fallback copy if the CMS is unreachable,
rather than failing outright.

## What's CMS-driven vs. static

| Area | Source |
| --- | --- |
| Header/footer navigation, contact details | CMS Settings + Menus |
| Home: hero slideshow, FAQ, CTA | CMS Page blocks (`home`) |
| Home: Signature Collections, Latest Insights | CMS Properties / Blog (live data) |
| Projects listing + property detail pages | CMS Properties |
| Blog listing + post detail pages | CMS Blog |
| About page: story text, closing CTA | CMS Page blocks (`about`) |
| Contact page: info cards, form heading | CMS Settings + Page blocks (`contact`) |
| Quick-enquiry / request-a-callback forms | POST to the CMS's public forms API |
| Explore-by-category tiles, stats band, testimonials, "why choose us" | Static (`lib/constants/`) — no matching CMS content model yet |
| ~12 secondary routes (services, careers, compare, gallery, FAQs, ...) | Static placeholders, not yet wired |

## Project structure

```
app/                      Routes (App Router), one folder per page
  layout.tsx               Root layout — fonts, metadata, CMS-fed Header/Footer, floating widgets
  page.tsx                 Home page — fetches CMS content, composes all sections
  property/[id]/            Property detail — fully dynamic, driven by CMS slug
  blog/[slug]/               Blog post detail — fully dynamic, driven by CMS slug

components/
  ui/                      Small, reusable, presentation-only primitives
  layout/                  Site chrome: Header, Footer, WhatsAppButton, LiveChatWidget
  sections/                Page sections: Hero, PropertyCard grids, ContactForm, EnquiryForm, ...

lib/
  cms.ts                   Fetch client for the CMS's `/public/*` API — the only surface this
                           app is allowed to call (no direct DB access, no admin endpoints)
  cms-mappers.ts           Adapters from CMS response shapes to this app's own types
  constants/               Content not yet wired to the CMS (categories, stats, testimonials, ...)
  context/                 PropertySearchContext, CompareContext

hooks/                    useAutoRotate, useScrolled, useCountUp
types/index.ts             Shared TypeScript interfaces
public/images/             Real + placeholder photography (see "Origin")
reference/                 Original bundled HTML export, kept for audit only — gitignored
```

## Origin

The site was originally reverse-engineered from a self-extracting HTML bundle (a
`<script type="__bundler/template">` holding the real markup as JSON, plus a base64 asset
manifest). That recovered the Home page's exact structure/copy/logic and the real photography
that existed in the original bundle (both hero photos, header/footer logos, favicon) — everything
else (property photos, blog images, testimonial avatars, hero slides 3–4) was never uploaded on
the original site either, so this rebuild ships clean on-brand placeholder graphics for those
instead of broken images. All of that content is now editable from the CMS regardless.

## Design system

Colors, spacing, and typography flow from `app/globals.css`'s `@theme` block — Tailwind v4
generates utility classes (`bg-navy-950`, `text-gold-400`, `font-heading`, ...) directly from
those tokens. Fonts are Playfair Display (headings) and Work Sans (body) via `next/font/google`.

## Related

- **Truzon CMS** — the admin backend and dashboard this site reads its content from.
