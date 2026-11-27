import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths = [
  '/',
  '/about',
  '/services',
  '/conditions',
  '/pricing',
  '/book',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/complaints',
  '/accessibility',
  '/services/musculoskeletal-physiotherapy',
  '/services/sports-rehabilitation',
  '/services/manual-therapy',
  '/services/post-operative-rehabilitation',
  '/services/exercise-therapy',
  '/services/mobility-rehabilitation',
  '/services/neurological-rehabilitation',
  '/services/cupping-therapy',
];
test('all pages render, have metadata, no broken internal links or overflow', async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  const titles = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), `unique title ${path}`).toBe(false);
    titles.add(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical!).pathname).toBe(path);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `overflow ${path}`,
    ).toBe(true);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')!)))
      links.add(href.split('#')[0]);
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBeLessThan(400);
});
test('home images load and no unauthorised reviews are rendered', async ({ page }) => {
  await page.goto('/');
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0))
      .toBe(true);
  }
  await expect(page.getByText('In their own words.')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: `artifacts/home-${test.info().project.name}.png`, fullPage: true });
});
test('navigation and keyboard-accessible accordion', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'About', exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goto('/faq');
  const summary = page.locator('summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
});
test('keyboard skip link reaches main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
test('booking validates and reports disabled delivery honestly', async ({ page }) => {
  await page.goto('/book?service=sports-rehabilitation');
  await expect(page.getByLabel('Preferred service')).toHaveValue('sports-rehabilitation');
  await page.getByRole('button', { name: 'Send Appointment Request' }).click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
  await expect(page.getByLabel('Full name')).toBeFocused();
  await page.getByLabel('Full name').fill('Test Person');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Telephone number').fill('07700900000');
  const date = new Date();
  date.setDate(date.getDate() + 7);
  await page.getByLabel('Preferred appointment date').fill(date.toISOString().slice(0, 10));
  await page.getByLabel('Preferred time (UK)').selectOption('Morning');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send Appointment Request' }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText(
    'Your request has not been sent',
  );
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});
test('contact enquiry works without requesting clinical free text', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('textarea')).toHaveCount(0);
  await page.getByLabel('Full name').fill('Test Person');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Telephone number').fill('07700900000');
  await page.getByLabel('Enquiry topic').selectOption('Pricing');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText('not been sent');
});
test('success and network error UI using mocked API, no real email', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('Full name').fill('Test Person');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Telephone number').fill('07700900000');
  await page.getByLabel('Enquiry topic').selectOption('Pricing');
  await page.getByRole('checkbox').check();
  await page.route('**/api/contact', (route) => route.abort());
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText('could not connect');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Your request has been sent to the practice. This is not a confirmed appointment.',
      }),
    }),
  );
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('not a confirmed appointment');
  await expect(page.getByRole('button', { name: 'Request sent' })).toBeDisabled();
});
test('API rejects malformed, cross-origin and invalid requests', async ({ request }) => {
  const endpoint = '/api/appointments';
  expect(
    (
      await request.post(endpoint, { headers: { origin: 'https://wrong.example' }, data: {} })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post(endpoint, {
        headers: { origin: 'http://127.0.0.1:3000', 'content-type': 'application/json' },
        data: Buffer.from('{'),
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post(endpoint, {
        headers: { origin: 'http://127.0.0.1:3000' },
        data: { name: 'x' },
      })
    ).status(),
  ).toBe(422);
});
test('404 and preview indexing protections', async ({ page, request }) => {
  const r = await page.goto('/does-not-exist');
  expect(r?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'A small detour.' })).toBeVisible();
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect((await request.get('/opengraph-image')).status()).toBe(200);
});
for (const path of ['/', '/book', '/contact', '/services', '/about', '/faq'])
  test(`automated WCAG scan ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
