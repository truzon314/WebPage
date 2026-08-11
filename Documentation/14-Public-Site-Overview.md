# Public Site Overview

A map of every page on truzonhomes.com and which part of the CMS controls its content. Nothing on the public site is edited directly — it's always driven by the CMS.

| Public page | Controlled by |
|---|---|
| Home (`/`) | [Pages → Home](04-Pages-and-Website-Builder.md) for the hero/sections, plus the top-priority [Properties](02-Properties-and-Projects.md) and featured [Testimonials](07-Careers-Gallery-Testimonials.md#testimonials) |
| About (`/about`) | [Pages → About](04-Pages-and-Website-Builder.md) |
| Projects (`/projects`) | [Properties](02-Properties-and-Projects.md) — every published property, in the priority order set there |
| An individual property (`/property/...`) | That property's own editor in [Properties](02-Properties-and-Projects.md), including its linked [site-layout map](05-Map-Management.md) if one's connected |
| Blog (`/blog`) | [Blog Posts](03-Blog-Posts.md) list |
| An individual blog post (`/blog/...`) | That post's editor in [Blog Posts](03-Blog-Posts.md) |
| Careers (`/careers`) | [Careers](07-Careers-Gallery-Testimonials.md#careers) |
| Gallery (`/gallery`) | [Gallery](07-Careers-Gallery-Testimonials.md#gallery) |
| Testimonials (`/testimonials`) | [Testimonials](07-Careers-Gallery-Testimonials.md#testimonials) |
| Contact (`/contact`) | [Pages → Contact](04-Pages-and-Website-Builder.md), and its form submits into [Form Submissions](08-Leads-Forms-and-Live-Chat.md) |
| FAQs, Investor Relations, Privacy Policy, Terms of Service | Fixed legal/info pages — content changes to these need a developer, they're not yet exposed as editable CMS content |
| Sitemap (`/sitemap`) | Generated automatically from published content — not directly editable |
| Saved Properties | Visitor-only — properties they've favorited on their own device, nothing to manage here |
| Header navigation & footer links | [Menus](09-Menus.md) |
| Live chat widget | [CRM](08-Leads-Forms-and-Live-Chat.md#live-chat-crm) inbox and auto-reply settings |
| Every image, brochure, and video shown anywhere | [Media Library](06-Media-Library.md) |
| Search-result appearance / social share previews for any page | That item's own **SEO & Social Metadata** panel, or the sitewide defaults in [SEO Module](10-SEO-Module.md) / [Settings](12-Settings.md) if left blank |

## A few things worth knowing

- **Unpublished content never appears on the public site**, no matter how complete it looks in the CMS. If something isn't showing up, check its status first.
- **Draft/Scheduled** blog posts and pages become visible automatically at their scheduled time — no one needs to manually publish them at that moment.
- Changing the **priority order** on the Properties list (drag-and-drop) is the only thing that changes what shows first on both the homepage and the Projects page — there's no separate "featured" toggle for that purpose.
