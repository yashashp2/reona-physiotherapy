# Pre-launch checklist

The application is intentionally in preview mode. Noindex is not access control: use protected hosting previews, and keep unapproved material offline.

## Owner and clinical content

- [ ] Approve first-person biography, philosophy and suggested copy.
- [ ] Verify active HCPC registration and CSP membership, obtain numbers if publication is approved, set each `verified` flag.
- [ ] Check qualifications/certifications against source documents and current status.
- [ ] Resolve Care Circle end-date conflict and confirm other timeline entries.
- [ ] Confirm independent clinical scope; set service and condition flags or disable entries.
- [ ] Confirm whether home visits, online consultations, neurological rehabilitation and cupping will be offered.
- [ ] Approve prices, durations, working hours, payment methods and cancellation terms.
- [ ] Approve public email/phone, actual clinics and service areas. Never use the residential address.
- [ ] Supply approved portrait/clinic imagery and check stock licences/consent.
- [ ] Add testimonials only with authentic text and documented authorisation.

## Privacy, contracts and governance

- [ ] Confirm business/data-controller identity and approved contact address.
- [ ] Approve lawful basis, retention schedule, provider contracts, processing regions and transfer safeguards.
- [ ] Set deletion procedures for practice inboxes, email-provider records, Redis and hosting logs.
- [ ] Review cancellation/consumer terms, complaints procedure and response times.
- [ ] Confirm professional indemnity, safeguarding, chaperone, referral and age-scope arrangements outside this website.
- [ ] Approve accessibility statement and provide an accessible contact route.
- [ ] Review security configuration; CSP currently allows inline Next.js scripts/styles. Add nonce/hash-based hardening if required, with an appropriate caching strategy.
- [ ] Do not add marketing/analytics cookies without reviewing consent requirements.

## Technical deployment

- [ ] Configure protected staging and separately scoped Vercel environments.
- [ ] Set a valid HTTPS `SITE_URL`, verified Resend sender, private recipient, Redis credentials and strong rate-limit secret.
- [ ] Verify emails in real practice and patient inboxes, including reply-to, spam filtering, bounces and retries.
- [ ] Verify real distributed rate limiting and provider-failure behaviour with synthetic data.
- [ ] Test the external booking URL, if configured. Confirm its privacy and accessibility arrangements.
- [ ] Test keyboard, screen-reader, zoom/reflow and real mobile devices.
- [ ] Run lint, type checks, unit tests, production build, Playwright and Lighthouse.
- [ ] Audit approved public pages and client bundles for private information.
- [ ] Set `practice.launchReady=true` only after all owner/content/legal gates are complete. Unconfirmed services/conditions/prices will disappear.
- [ ] Set `ENQUIRIES_ENABLED=true` only when real delivery checks pass.
- [ ] Connect the custom domain and HTTPS, configure canonical redirects, rebuild.
- [ ] Verify robots/sitemap/canonicals/social image and structured data on the real domain.
- [ ] Submit sitemap to search tools only after the launch decision.
- [ ] Record approvals, accessibility review date, maintenance owner and routine review schedule.
