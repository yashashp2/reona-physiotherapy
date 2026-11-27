import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const problems = [];
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: 'reduce',
  });
  page.on('pageerror', (error) => problems.push({ width, error: error.message }));
  for (const path of ['/', '/book', '/about', '/services/manual-therapy', '/pricing']) {
    await page.goto(`http://127.0.0.1:3000${path}`);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    if (overflow) problems.push({ width, path, error: 'horizontal overflow' });
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `artifacts/${path === '/' ? 'hero' : path.replaceAll('/', '-')}-${width}.png`,
      });
  }
  await page.close();
}
await browser.close();
await writeFile(
  'artifacts/responsive-check.json',
  JSON.stringify({ widths: [320, 390, 768, 1024, 1440, 1920], problems }, null, 2),
);
console.log(JSON.stringify({ responsiveProblems: problems }));
if (problems.length) process.exitCode = 1;
