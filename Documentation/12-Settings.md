# Settings

Site-wide configuration, split into tabs.

## General

- **Site name**, **Logo**, **Favicon** (the small icon in a browser tab).
- **Contact email**, **Contact phone**, **Callback phone** (shown on every "request a callback" section), **WhatsApp number** (digits with country code, e.g. `919000012345`), **Contact address**.
- Two specific photos used elsewhere on the site: the **Home page "Why Choose Us"** photo, and the **Contact page office/map** photo.

Changing the contact phone/WhatsApp number here updates it everywhere on the public site at once — you don't need to hunt down every page it appears on.

## Social Links

Facebook, Instagram, LinkedIn, and YouTube URLs — these feed the social icons shown in the site footer. Leave any blank to hide that icon.

## SMTP (Email)

Controls whether the CMS can actually send real emails — password resets, user invites, and any other system email. Without this configured, those emails just get logged internally instead of delivered, and nobody receives anything.

| Field | What goes here |
|---|---|
| SMTP host | Your email provider's server address (e.g. `smtp.gmail.com`) |
| Port | Usually `587` |
| Username | Your email address |
| Password | An app-specific password, not your normal login password |
| From email | The address recipients see it come from |
| Use STARTTLS | Leave checked |

**Quickest way to get started (Gmail, free):** turn on 2-Step Verification on the Google account, generate an **App Password** under Security → App Passwords, and use that as the SMTP password above with host `smtp.gmail.com`, port `587`. Gmail has daily sending limits, so for real production use switch to a dedicated provider (SendGrid, Mailgun, Resend, Brevo — all have free tiers and use the same fields).

**To confirm it's working:** invite a test user or use "Forgot password" and check whether the email actually arrives.

## Analytics

Google Analytics Measurement ID — connects the public site to Google Analytics for visitor tracking. (Additional tracking IDs like Tag Manager and Meta Pixel live under the [SEO Module's Global Settings tab](10-SEO-Module.md#global-settings) instead.)

## SEO

A shortcut into the same site-wide SEO defaults covered in [10 — SEO Module](10-SEO-Module.md#global-settings) — meta title/description fallbacks, verification codes, and social share defaults.
