/** Measure animation frames, not just the final text or a successful build. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = 4786;
let server;
let browser;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const url = process.argv[2] || `http://127.0.0.1:${port}/`;

async function sample(page, selector) {
  // Direct scrolling lets us record the first frame before animations finish.
  await page.locator(selector).evaluate(el => el.scrollIntoView({ block: 'end', behavior: 'instant' }));
  return page.evaluate(async () => {
    const frames = [];
    const start = performance.now();
    while (performance.now() - start < 1900) {
      frames.push({
        bars: [...document.querySelectorAll('.metric-bar')].map(el => el.getBoundingClientRect().height),
        values: [...document.querySelectorAll('.metric-value')].map(el => parseInt(el.textContent, 10)),
        progress: document.querySelector('.metric-progress').getBoundingClientRect().width,
        dots: [...document.querySelectorAll('.metric-project-dot')].filter(el => Number(getComputedStyle(el).opacity) > 0.95).length,
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return frames;
  });
}

function counterMoves(frames, index, target) {
  assert(frames.some(frame => frame.values[index] > 0 && frame.values[index] < target), `Counter ${target} skipped animation`);
  assert.equal(frames.at(-1).values[index], target);
}

try {
  if (!process.argv[2]) {
    server = spawn(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'ignore' });
    for (let i = 0; i < 40; i++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await pause(250);
    }
  }
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [width, height, reducedMotion] of [[1440, 900, 'no-preference'], [390, 844, 'no-preference'], [360, 740, 'no-preference'], [390, 844, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Ablehnen', exact: true }).click();
    const chartFrames = await sample(page, '.metric-chart');
    const finalBars = chartFrames.at(-1).bars;
    assert(finalBars[0] > 0, 'Before bar has no height');
    assert(Math.abs(finalBars[1] / finalBars[0] - 8) < 0.05, 'Bars must show a 1:8 ratio');
    if (reducedMotion === 'no-preference') {
      assert(chartFrames.some(frame => frame.bars[1] > 0 && frame.bars[1] < finalBars[1] * 0.9), 'Growth bar did not animate');
      counterMoves(chartFrames, 0, 8);
    }
    const daysFrames = await sample(page, '[data-metric="days"]');
    const projectFrames = width >= 768 ? daysFrames : await sample(page, '[data-metric="projects"]');
    if (reducedMotion === 'no-preference') {
      counterMoves(daysFrames, 1, 90);
      counterMoves(projectFrames, 2, 300);
      const end = daysFrames.at(-1).progress;
      assert(daysFrames.some(frame => frame.progress > 0 && frame.progress < end * 0.9), 'Progress bar did not animate');
      assert(projectFrames.some(frame => frame.dots > 0 && frame.dots < 30), 'Project dots did not animate in sequence');
    }
    assert.equal(daysFrames.at(-1).values[1], 90);
    assert.equal(projectFrames.at(-1).values[2], 300);
    assert.equal(projectFrames.at(-1).dots, 30);

    // Fast reverse scrolling must preserve completed, visible graphics.
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('.metric-chart').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(100);
    const final = await page.evaluate(() => ({
      bars: [...document.querySelectorAll('.metric-bar')].map(el => el.getBoundingClientRect().height),
      overflow: document.documentElement.scrollWidth > innerWidth,
      whatsapp: [...document.querySelectorAll('a[href*="wa.me"] svg')].map(el => getComputedStyle(el).color),
      values: [...document.querySelectorAll('.metric-value')].map(el => parseInt(el.textContent, 10)),
    }));
    assert.equal(final.overflow, false);
    assert.deepEqual(final.values, [8, 90, 300]);
    assert(final.bars.every(value => value > 0));
    assert(final.whatsapp.length >= 4 && final.whatsapp.every(color => color === 'rgb(37, 211, 102)'), 'Every WhatsApp icon must use #25D366');
    assert.deepEqual(errors, []);
    await page.locator('[data-metric="enquiries"]').evaluate(el => {
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'instant' });
      document.activeElement?.blur();
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `/tmp/dm-eu-metrics-${width}-${reducedMotion}.png` });
    console.log(`PASS ${width}×${height} ${reducedMotion}: bars 1:8, counts 8/90/300, progress, 30 dots, reverse scroll, green WhatsApp icons`);
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
