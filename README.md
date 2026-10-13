# Inventive Clicks: Next.js 3D Theme

An editable, responsive Next.js App Router website based on the supplied Inventive Clicks designs. The theme includes 45 individual pages, service navigation, portfolio concepts and editorial articles. The visual theme includes HD generated artwork, glossy 3D service icons, pointer-reactive perspective, floating hero artwork, gradient animation, scroll reveals, and accessible reduced-motion handling.

## Quick start

Install Node.js 20.9 or newer, unzip the project, open a terminal in its folder, and run:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No API keys or paid plugins are needed.

## Production

```sh
npm run build
npm start
```

`npm start` runs the Next.js server (`next start`) at http://localhost:3000. Set `PORT` to change its port. Pages are still pre-rendered at build time; the server also runs the API routes used by the free SEO tools.

## Live deployment (Hostinger VPS)

inventiveclicks.com runs as a Next.js server on the VPS (72.62.193.221), behind Cloudflare and nginx:

- App: `/var/www/inventiveclicks/app` (a clone of this repo), run by the systemd unit `inventiveclicks` on 127.0.0.1:3110.
- Settings and API keys: `/etc/inventiveclicks.env` (root-only). After editing it, run `systemctl restart inventiveclicks`.
- Tool cache and usage counters: `/var/lib/inventiveclicks`.
- nginx: `/etc/nginx/sites-available/inventiveclicks.com` redirects http and www to https://inventiveclicks.com and proxies to the app.

Push to `main`, then deploy with (needs an `inventiveclicks-vps` host in `~/.ssh/config`):

```sh
bash scripts/deploy-vps.sh
```

To roll back, check out an earlier commit in `/var/www/inventiveclicks/app` as the `inventiveclicks` user, run `npm run build`, then restart the service.

## Free SEO tools

Tools are listed in `lib/tools.ts` and shown on `/tools`. Add a tool by adding an entry there and a page under `app/(inner)/tools/<slug>/`.

**Website Deep Audit** (`/tools/website-audit`, code in `lib/audit/` and `components/SiteAudit.tsx`) runs on our own server with no paid API keys: 100+ checks in 14 areas (on-page, technical, speed, mobile and accessibility, security, local SEO, off-page and authority, AEO, GEO and AI search, content and E-E-A-T, social and tracking, links, broken pages and a site-wide crawl of up to 25 pages). Off-page signals come from free public sources: Tranco, RDAP, the Internet Archive and Wikidata. Requests to private or internal addresses are blocked.

Visitors see their score and category scores first. The server releases the full report only after they submit name, email and phone (`/api/tools/audit/unlock`). Leads are stored in `/var/lib/inventiveclicks/leads.jsonl` and listed at **https://inventiveclicks.com/admin/leads** (user `admin`, password = `ADMIN_PASSWORD` in `/etc/inventiveclicks.env`), with a CSV download.

Settings in `/etc/inventiveclicks.env`:

| Variable | Used for |
|---|---|
| `ADMIN_PASSWORD` | Password for /admin/leads (12+ characters; the page is off when empty) |
| `PAGESPEED_API_KEY` | Optional: adds Google PageSpeed (Core Web Vitals) scores |
| `AUDITS_PER_IP_PER_DAY` | Daily audits per visitor (default 10) |

## Brand assets

The logo source is `public/brand/ic-logo-source.png`. Run `node scripts/make-share-images.mjs` to regenerate the header logo, favicons, schema logo and social share image from it.

## Customize

- `app/page.tsx`: homepage and hero slides.
- `lib/content.ts`: service, portfolio and article content.
- `app/(inner)/`: independent page routes.
- `components/SiteChrome.tsx`: shared navigation and footer.
- `components/BriefForm.tsx`: local brief downloads.
- `app/globals.css`: original reference styling plus the clearly marked HD / 3D enhancement layer.
- `components/Motion.tsx`: pointer tilt and scroll-reveal behavior, including cleanup and reduced-motion preferences.
- `public/images/`: high-resolution generated artwork optimized for delivery.
- `public/design-reference.png`: supplied original logo source; preserved for fidelity.
- `app/layout.tsx`: title, description, favicon, canonical metadata base.
- `public/brand/`: Inventive Clicks logo (source and header version).
- `ASSETS.md`: image sources and generation notes.

Fonts load from Google Fonts, with local system fallbacks if unavailable. All artwork is bundled locally. Animation uses CSS and browser APIs without animation libraries or WebGL dependencies. Pointer tilt applies only to mouse/fine-pointer devices. Reduced-motion settings disable animation and tilt. Content remains readable with JavaScript disabled.

## Current functional scope

This is a frontend theme, not an installed WordPress theme. It contains working hero slide controls, section navigation, mobile menu, individual service pages and a local project-brief download.

Contact and newsletter delivery are **not connected** to an email service/backend. The project brief is saved on the visitor's device and is not submitted. Careers has a complete page and candidate-profile form with no invented job openings. Blog has three complete editorial articles. Work has three labelled illustrative concept pages. The story button opens About. No showreel video was supplied.

Platform names identify relevant tools, not clients or endorsements. Unverified client counts, growth percentages and the demo testimonial have been removed. The generated office and device artwork are illustrative, not verified photographs of actual premises or client projects.

## Archive contents

Editable source, npm lockfile, all local assets, setup documentation, and a ready-to-upload static `out/` build. Dependencies (`node_modules`), cache, credentials and private hosting metadata are excluded. Run `npm ci` to install dependencies.

## Version 3 routes

45 content pages, plus a custom 404, robots.txt and sitemap.xml. Each page has its own URL, title, description and canonical metadata.

- `/careers`
- `/work`
- `/contact`
- `/about`
- `/blog`
- `/`
- `/terms-and-conditions`
- `/services`
- `/privacy-policy`
- `/blog/planning-a-remote-role`
- `/blog/a-clearer-marketing-brief`
- `/blog/landing-page-content-checklist`
- `/services/content-creation`
- `/services/graphics-branding`
- `/services/seo`
- `/services/e-commerce-solutions`
- `/services/web-development`
- `/services/influencer-marketing`
- `/services/ppc`
- `/services/remote-staffing`
- `/services/digital-marketing`
- `/services/social-media-marketing`
- `/work/local-business-growth`
- `/work/ecommerce-experience`
- `/work/saas-product-launch`

The included npm start server supports clean URLs. For other static hosts, configure extensionless URLs to resolve exported .html files. Contact and candidate forms download local briefs; email delivery is not connected.

## Contact and WhatsApp setup

Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your verified business number including country code (digits only), then rebuild. Without this value, WhatsApp buttons lead to the contact preferences section; they do not open a chat. With it, visitors can review their brief and open WhatsApp to send it themselves. Phone and WhatsApp fields are optional, with a same-number checkbox and preferred-contact selector. Email delivery still requires a backend integration.

## Search and mobile improvements

Includes contextual project CTAs, service-specific enquiry links, mobile sticky contact actions, accessible navigation, responsive form layouts, visible FAQs, descriptive metadata, canonical URLs, a sitemap and Organization, WebSite, Service, Article and BreadcrumbList structured data. These support discovery without guaranteeing rankings or inclusion in AI answers. Connect the production domain and make the site publicly accessible before expecting indexing. Copy is AI-assisted and edited for clarity; it is not certified human-written.

## Expanded service catalogue

Thirty services are organised into five categories on the services page and mega menu. Each service has a dedicated page, a contact-form option and a sitemap entry. Edit `lib/additional-services.ts` for the 20 additional services and `lib/service-groups.ts` to change grouping.

## Service landing pages and platform marketing

All 30 service pages use service-specific content and relevant visual treatments for commerce, social, technology, creative work, team support and growth. Social media and e-commerce include complete solution sections. Thirteen platform pages cover organic marketing, paid campaigns and optimization, linked from the services hub, mega menu, contact form and sitemap. Edit `lib/platforms.ts` and `components/ServiceLanding.tsx` to maintain these sections.
