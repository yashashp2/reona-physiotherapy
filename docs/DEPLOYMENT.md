# Vercel deployment

Source repository: https://github.com/yashashp2/reona-physiotherapy (private). No hosted deployment or domain has been created.

1. Review Git's staged files. The original PDFs, `.env.local`, build outputs and test screenshots must remain ignored.
2. Push approved updates to the private source repository.
3. Import it in Vercel. Select the Next.js preset and Node.js 24. Install command: `npm ci`. Build command: `npm run build`. Keep the framework's default output handling; do not set `output: 'export'`.
4. Add the variables from `.env.example` in Project Settings → Environment Variables. Scope development/preview/production separately. Use test inboxes and separate Redis credentials for staging.
5. Keep `practice.launchReady=false` and `ENQUIRIES_ENABLED=false` for the initial protected preview. Production publication must wait for content approval. A noindex directive is not a security boundary.
6. Set `SITE_URL` to the exact URL being used. Origin validation deliberately does not accept arbitrary hosts or blindly trust the request Host header. Stable staging domains make testing easier.
7. Deploy, run checks on the actual deployment, verify security headers, inspect the custom 404 and test image optimisation. Check the server region and provider processing arrangements.
8. Complete `PRE-LAUNCH-CHECKLIST.md`, enable the launch/delivery settings, rebuild and verify both emails using synthetic data. API acceptance does not prove inbox delivery.

## Custom domain

1. In Project Settings → Domains, enter the approved domain you own.
2. Add the DNS records Vercel displays at your DNS provider. Do not guess fixed IP values from old tutorials.
3. Wait for Vercel to verify DNS and issue HTTPS certificates.
4. Choose either the apex or `www` domain as canonical and redirect the other to it.
5. Set production `SITE_URL` to that HTTPS origin, redeploy and check canonical tags, Open Graph URLs, robots and sitemap.
6. Verify Resend's sending-domain records separately. Website DNS does not automatically authorise email sending.

## Self-hosting

The build can run with `npm run start`, but the network rate-limit adapter is Vercel-aware. Other hosts use a conservative shared bucket until a trusted proxy/IP adapter is implemented. Configure a reverse proxy, HTTPS, request limits and secure environment management. Do not simply trust a public `x-forwarded-for` header. Persist rate limiting in Redis, not process memory.

## Operational limits

There is no medical database, payment processor, availability calendar, email webhook receiver or durable delivery queue. An external appointment system can be linked through config. Monitor delivery errors in the provider dashboard, keep dependencies reviewed, manage inbox access and enforce retention policies. Do not log form bodies during troubleshooting.
