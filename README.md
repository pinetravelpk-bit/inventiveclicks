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

The production preview opens at http://localhost:3000. Set `PORT` to change its port. The project uses Next.js static export; the small included Node server serves `out/`. `next start` is not used with static export.

Upload the **contents** of `out/` to a static host, or import the source into a Next.js-compatible host with build command `npm run build` and output directory `out`. Connect inventiveclicks.com in your hosting provider and update DNS there. The ZIP does not change your domain settings.

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
- `public/favicon.svg`: editable small brand favicon.
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
