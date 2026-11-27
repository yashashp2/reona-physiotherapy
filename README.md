# Reona Barretto Physiotherapy

A complete Next.js App Router website for an independent physiotherapy practice. Built with TypeScript, Tailwind CSS, Motion, Lucide, React Hook Form, Zod, Resend and Upstash Redis. The default state is a **non-indexable practice preview**, with no live enquiry delivery and no invented prices or contact details.

## Start locally

Use Node.js 24 LTS and npm. Versions are recorded in `package-lock.json`.

ESLint is pinned to the latest 9.x release compatible with the React/import/accessibility plugins currently shipped by `eslint-config-next`. ESLint 10 is newer but those plugin peer ranges do not yet support it. Review this development-tool constraint when upgrading dependencies; do not force incompatible peer dependencies.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Visit **http://127.0.0.1:3000**. Do not overwrite an existing `.env.local` containing credentials. Set `SITE_URL` to the exact browser origin you use; `localhost` and `127.0.0.1` are different origins. Fonts are downloaded at build time by Next.js and hosted locally at runtime. The initial build needs internet access to Google Fonts.

```powershell
npm run build
npm run start
```

## Architecture

```text
src/app/                     App Router pages, route metadata, SEO assets
  services/[slug]/           Eight statically generated treatment pages
  (legal)/[document]/        Four configurable legal/info pages
  api/appointments/         POST appointment request endpoint
  api/contact/              POST non-clinical contact enquiry endpoint
src/components/              Shared header, footer, cards, FAQs, forms and animation
src/config/practice.ts       Typed practice, services, prices, FAQs and content
src/config/legal.ts          Owner-review legal templates
src/lib/validation.ts        Shared Zod schemas and London-date validation
src/lib/enquiries.ts         Server-only delivery, rate limits and request checks
src/lib/seo.ts               Metadata and safely serialised structured data
public/images/               Locally hosted illustrative photographs
tests/                      Unit/API-boundary and Playwright tests
docs/                       Sources, deployment, launch and verification notes
```

Most pages are server components. Only the mobile navigation, request form and subtle entrance motion need client JavaScript. Service pages and policy pages are generated at build time. Booking reads an optional `?service=slug`. API routes use the Node.js runtime and do not create medical records or persist form bodies in an application database.

## Update practice information

Edit `src/config/practice.ts` and rebuild:

- `practice`: name, title, biography, qualifications, registrations, professional experience, approved public contact details, clinics, service areas, working hours, social links, policies and portrait.
- `services`: set `enabled: false` to remove a service from pages, links, booking choices and sitemap. Set `confirmed: true` only after Reona confirms scope and availability. In launch mode unconfirmed services are omitted automatically, including direct slug access.
- `conditions`: independent `enabled` and `confirmed` flags; only confirmed entries are shown in launch mode.
- `prices`: use `amountGBP: null` for “Contact for pricing”; leave `durationMinutes: null` until known. `confirmed` distinguishes availability. Home visits and online appointments are proposed only.
- `faqs`: edit the answer and its confirmation flag. Confirm practice-specific policies before launch.
- `testimonials`: the entire section remains hidden unless an entry has `authorised: true`. Store only publication-approved content.
- `practice.experience`: the Care Circle end date is deliberately `null` because the two CVs conflict. Replace it only after clarification.

Only approved public business details belong in this file; it is imported by client-side validation. **Never add CV addresses, private contact details, API keys or patient data.** The two CV files remain local, are ignored by Git, and are not inside `public/`.

Edit policy text in `src/config/legal.ts`. Templates explicitly identify missing controller details, retention, lawful basis, processor/transfer arrangements, cancellation terms and complaint response times. Technical features do not establish UK GDPR compliance.

### Photograph replacement

See `public/images/README.md` and `docs/CONTENT-SOURCES.md`. Existing photographs are illustrative stock, labelled on the site, and do not depict Reona or her clinic.

1. Add an approved portrait such as `public/images/reona-portrait.jpg`.
2. Set `practice.portrait = { src: '/images/reona-portrait.jpg', alt: 'Reona Barretto, physiotherapist' }`.
3. Replace service image paths in the central config. Keep descriptive alt text appropriate to the actual image.
4. The portrait component updates the homepage and About page together. Before then, the hero uses labelled treatment photography and the About section uses a designed monogram fallback.
5. Confirm consent, licensing and image metadata before publishing. Do not upload identifiable patient images without suitable permission.

Images use `next/image`, responsive sizes, reserved aspect ratios and lazy loading below the hero. Genuine clinic photography is not yet supplied.

## Environment variables

Copy `.env.example` to `.env.local` locally; configure values separately in Vercel for each environment. Never commit secrets or prefix them with `NEXT_PUBLIC_`.

| Variable                   | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `SITE_URL`                 | Exact canonical website origin, HTTPS in production; also the permitted form origin |
| `ENQUIRIES_ENABLED`        | Explicit `true` to allow delivery after launch approval                             |
| `RESEND_API_KEY`           | Server-side Resend sending key                                                      |
| `ENQUIRY_FROM`             | Sender using a domain verified in Resend                                            |
| `ENQUIRY_TO`               | Private inbox receiving practice notifications                                      |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis HTTPS REST endpoint                                                   |
| `UPSTASH_REDIS_REST_TOKEN` | Redis credential for rate limiting                                                  |
| `RATE_LIMIT_SECRET`        | Strong random secret for pseudonymising rate-limit identifiers                      |

Generate the last value locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and enter it directly into your environment manager. Do not paste it into source or support logs. Vercel supplies `VERCEL=1` automatically; do not set it to simulate a trusted proxy on another host.

The API returns **503 without sending** when any required service configuration is absent, `practice.launchReady` is false, or `ENQUIRIES_ENABLED` is not `true`. It also fails closed if the rate limiter fails or times out.

## Configure email delivery

1. Create and verify a sending domain in Resend using its required DNS records. Configure SPF/DKIM and review DMARC with your domain provider.
2. Set `RESEND_API_KEY`, `ENQUIRY_FROM` and `ENQUIRY_TO`. Use an approved, access-controlled practice inbox with MFA.
3. Provision Upstash Redis in a suitable region. Set its URL/token and `RATE_LIMIT_SECRET`.
4. Complete `docs/PRE-LAUNCH-CHECKLIST.md`, approve the legal notices, then enable the launch and enquiry flags.
5. Submit synthetic requests first. Verify both practice notification and acknowledgement in real inboxes, not just a 200 response. Inspect provider events for bounces and delivery failures without logging personal data in the app.
6. Test retry behaviour, rate limiting and outages on a controlled staging environment.

Delivery is sequential: the practice email must be accepted before the acknowledgement is requested. If the acknowledgement fails, the interface says the request reached the practice and does not encourage duplicate submission. Resend idempotency keys prevent duplicate email requests for identical retries within its provider window. Provider acceptance is **not proof of inbox delivery**. Delivery can remain uncertain after a network timeout; there is no durable email job queue or webhook receiver in this project. Clinical information must not be sent in these emails.

Rate limiting uses distributed 15-minute sliding windows, five requests per network identifier and per email identifier, across both APIs. Identifiers are HMAC hashes, not raw contact details. On Vercel the code uses `x-vercel-forwarded-for`; on other hosts a conservative shared network bucket is used until a trusted-proxy adapter is configured. Browser-supplied forwarding headers must not be trusted. This is baseline spam protection, not a guarantee against distributed abuse; add hosting-level limits as appropriate.

The API checks origin, content type, an 8 KiB streamed body limit, strict schemas, date validity, a hidden honeypot and rate limits. It sends plain text and does not expose provider errors. No analytics or non-essential cookie banner is added because the application does not set those cookies.

## Appointment integrations

Set `practice.bookingUrl` to an approved **HTTPS** Cliniko (or equivalent) booking URL. The booking page adds an explicitly labelled external-provider link. This is a configurable integration point, not an API synchronisation, embedded scheduler or real-time availability check. The external provider controls its booking process and privacy notice. Do not place API tokens or patient details in the URL. The internal form is always an appointment **request**, not a confirmed booking.

## Tests and quality checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

To use installed Edge on Windows instead of downloading Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:e2e
```

Playwright runs desktop and mobile Chromium contexts and starts the production server if port 3000 is free. Close a dev server before a production QA run. It uses only synthetic data with delivery disabled. Unit tests mock Resend and Redis; UI success tests mock API responses. These **do not test real third-party delivery**.

Coverage includes all routes and internal links, unique metadata, image loading, overflow, custom 404, noindex, form validation and service preselection, success/failure UI, keyboard menu and accordion controls, skip link, API errors, rate-limit fail-closed behaviour and axe WCAG scans. Manual assistive-technology and real-device checks remain necessary.

For Lighthouse, run against a production server with `npx lighthouse http://127.0.0.1:3000 --output html --output-path artifacts/lighthouse.html --chrome-flags="--headless"`. Set `CHROME_PATH` if Chrome is not automatically found. Preview deliberately uses `noindex`, which lowers the SEO audit; do not remove that protection merely to improve a score.

## Deploy to Vercel and connect a domain

See `docs/DEPLOYMENT.md` for the full procedure. Import the repository into Vercel with the Next.js preset, Node.js 24, `npm ci` and `npm run build`. This project requires server functions and **must not be deployed as a static export**. Use protected previews while details are unapproved.

Configure environment variables for the intended environment, set `SITE_URL` to its exact origin, deploy and test the preview. In Project Settings → Domains, add the approved custom domain, apply the DNS records Vercel supplies, verify HTTPS and choose a canonical domain. Set `SITE_URL` to that HTTPS origin, configure redirect aliases, rebuild, and repeat real delivery/SEO checks. No deployment or domain purchase has been performed as part of this local build.

## Current limitations

- Genuine portrait, approved contacts, bookable locations, service areas, hours, prices, durations, policies and independent service scope remain unconfirmed.
- Registration and membership are CV statements, not independently verified register entries.
- Care Circle employment end dates conflict; the end date is omitted.
- Legal notices are templates requiring owner and appropriate professional review.
- Resend, Redis, external booking and deployment require configuration and live verification.
- The website is not a medical record system, emergency channel or confirmed-booking scheduler.

See `docs/VERIFICATION.md` for actual checks and remaining verification limits.
