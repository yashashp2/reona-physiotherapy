# Verification record

Local verification on 27 November 2026, Windows, Node.js 24.12.0. This records observed checks, not a certification of clinical, legal or accessibility compliance.

## Completed checks

| Check | Result |
| --- | --- |
| Dependency installation | Completed; lockfile supplied |
| Development server | Started successfully; homepage returned HTTP 200 |
| ESLint | Passed, no lint errors or warnings |
| TypeScript | Passed |
| Unit/API-boundary tests | 27 passed |
| Production build | Passed; 28 generated routes/assets including 20 content pages |
| Playwright desktop/mobile | 30 passed against production build |
| Route and link coverage | All 20 content pages and internal navigation links passed |
| Forms | Validation, service preselection, preview-disabled responses, mocked success and network-error UI passed |
| API | Cross-origin, malformed JSON, oversized body, invalid fields, honeypot, rate-limit denial/timeout/failure and delivery-provider errors covered |
| Keyboard | Skip link, navigation, Escape handling, accordion and invalid-field focus passed |
| Automated accessibility | No axe violations on home, booking, contact, services, about and FAQ in desktop/mobile contexts |
| Responsive checks | No horizontal overflow or page errors at 320, 390, 768, 1024, 1440 and 1920px on home, booking, about, pricing and a service page |
| Images | Homepage photographs loaded with non-zero intrinsic sizes; representative desktop/mobile captures inspected |
| Indexing safeguards | Preview noindex, robots block, empty sitemap and custom 404 verified |
| Privacy boundary | No private CV address, telephone or email in public/source content; original PDFs and `.env.local` ignored by Git |
| Dependency audit | No reported vulnerabilities at time of check |

## Lighthouse mobile audit

Measured against the final local production build with Lighthouse 13.6.0 and headless Edge:

| Category | Score |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 69 |

SEO's only failed audit was **Page is blocked from indexing**, deliberately caused by preview `noindex` and robots restrictions. All other scored SEO audits passed. Keep this protection until the owner approves launch, then repeat the audit on the real HTTPS domain. This is not a prediction of production search ranking.

Observed lab metrics: FCP 1.1 s, LCP 1.1 s, total blocking time 100 ms and CLS 0. Local lab results are not field Core Web Vitals and will vary by deployment, network and device. Reports: `artifacts/lighthouse-mobile.report.html` and `.json`.

## Test boundaries

- Unit tests replace Resend and Redis with mocks. They validate application control flow, not the availability or behaviour of a provisioned production account.
- Browser tests use synthetic details only; preview mode blocks outgoing email. A separate browser test mocks a successful API response to test the success state.
- A 200 response means the email provider accepted the send request; it does not prove inbox delivery.
- No real Resend delivery, Redis account integration, Cliniko appointment flow, custom domain or Vercel deployment has been tested. Credentials/services were not supplied.
- Browser automation used installed Microsoft Edge with Chromium desktop and mobile emulation. These are not physical iPhone, Safari, VoiceOver or NVDA tests.
- The in-app browser connector was unavailable. Playwright screenshots and automated browser interaction were used for local QA.
- No field Core Web Vitals, user testing, penetration test or independent accessibility audit was performed.

## Saved evidence

Ignored local artifacts include `artifacts/home-desktop.png`, `artifacts/home-mobile.png`, first-screen and booking screenshots, `artifacts/responsive-check.json`, Lighthouse reports and `playwright-report/index.html`. They can be regenerated with `npm run test:e2e` and `node scripts/capture.mjs` while the production server runs. On this Windows computer use `PLAYWRIGHT_CHANNEL=msedge`.

## Maintenance note

ESLint 9 is retained for compatibility with the peer dependencies of Next.js's current lint plugins. The registry marks that major deprecated; upgrade the lint toolchain together once those plugins support ESLint 10. Runtime dependencies are separate from this development-tool constraint.
