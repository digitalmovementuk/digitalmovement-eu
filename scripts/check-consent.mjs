/** Browser regression checks. Lead delivery and GA collection are intercepted;
 * only the real Google tag script is downloaded. No test leads are sent. */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const KEY = 'dm-eu-consent-v2', ID = 'G-H2NP3R3KJT';
const UTM = '?utm_source=facebook&utm_medium=paid_social&utm_campaign=tracking_check_20260910&utm_id=qa_20260910&utm_term=qa_adset&utm_content=qa_visit';
const LP = '/mehr-sales-f%C3%BCr-dein-business/';
const pause = ms => new Promise(r => setTimeout(r, ms));
const results = [], errors = [];
let server, browser;
let base = process.argv[2];
const record = (test, details = {}) => { results.push({ test, passed: true, ...details }); console.log('PASS ' + test); };
try {
  if (!base) {
    const port = 5100 + Math.floor(Math.random() * 300);
    server = spawn(process.execPath, [ROOT + '/node_modules/vite/bin/vite.js', 'preview', '--port', String(port), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
    base = `http://localhost:${port}`;
    for (let i = 0; i < 40; i++) { try { if ((await fetch(base)).ok) break; } catch {} await pause(250); }
  }
  base = base.replace(/\/$/, '');
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  async function setup(seed, viewport = { width: 1440, height: 900 }) {
    const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const requests = [], collects = [], deliveries = [];
    const delivery = { succeed: false };
    await ctx.route('**/*', async route => {
      const req = route.request(), u = new URL(req.url());
      if (u.hostname === 'leads.digitalmovement.uk') {
        deliveries.push({ mocked: true, status: delivery.succeed ? 200 : 500 });
        await route.fulfill({ status: delivery.succeed ? 200 : 500, contentType: 'application/json', body: JSON.stringify({ ok: delivery.succeed }) }); return;
      }
      if (/google-analytics\.com$/.test(u.hostname) && /collect/.test(u.pathname)) {
        collects.push({ url: req.url(), body: req.postData() || '' });
        await route.fulfill({ status: 204 }); return;
      }
      // Prevent every other external POST (including advertising endpoints).
      if (req.method() === 'POST' && u.origin !== new URL(base).origin) { await route.fulfill({ status: 204 }); return; }
      if (req.resourceType() === 'media') { await route.abort(); return; }
      await route.continue();
    });
    ctx.on('request', req => { if (/google|doubleclick|facebook|connect\.facebook/.test(new URL(req.url()).hostname)) requests.push(req.url()); });
    ctx.on('page', page => page.on('pageerror', e => errors.push(e.message)));
    if (seed) await ctx.addInitScript(({ key, value }) => {
      if (window.top === window && /^https?:$/.test(location.protocol)) localStorage.setItem(key, value);
    }, seed);
    const p = await ctx.newPage();
    return { ctx, p, requests, collects, deliveries, delivery };
  }
  const events = p => p.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event').map(e => ({ name: e[1], parameters: e[2] })));
  const gaCookies = async ctx => (await ctx.cookies()).filter(c => /^_ga/.test(c.name));
  async function choose(p, accept) { await p.getByRole('button', { name: accept ? 'Zustimmen' : 'Ablehnen', exact: true }).click(); }
  async function accepted(t) {
    await choose(t.p, true);
    await t.p.waitForFunction(() => document.cookie.includes('_ga='), { timeout: 20000 });
    await pause(6500);
  }
  for (const path of ['/', LP]) {
    const t = await setup();
    await t.p.goto(base + path + UTM); await pause(1600);
    assert.equal(t.requests.length, 0); assert.equal((await gaCookies(t.ctx)).length, 0);
    if (path === LP) { assert.equal(await t.p.evaluate(() => window.DM_TRACK.ereignis('preconsent_test', {})), false); }
    record(path + ': no Google requests or analytics cookies before choice');
    await choose(t.p, false); await t.p.reload(); await pause(1000);
    assert.equal(t.requests.length, 0); assert.equal((await gaCookies(t.ctx)).length, 0);
    await t.p.getByText('Cookie-Einstellungen', { exact: true }).click();
    await accepted(t);
    assert.equal(t.requests.filter(u => u.includes('/gtag/js')).length, 1);
    const cookies = await gaCookies(t.ctx);
    assert(cookies.every(c => c.expires * 1000 <= Date.now() + 180 * 86400000 + 3000));
    const pageviews = t.collects.filter(c => (c.url + c.body).includes('en=page_view'));
    assert.equal(pageviews.length, 1);
    const pageUrl = new URL(pageviews[0].url).searchParams.get('dl');
    assert.equal(new URL(pageUrl).search, UTM);
    const commands = await t.p.evaluate(() => window.dataLayer.filter(e => e[0] === 'consent').map(e => e[2]));
    assert(commands.every(c => c.ad_storage === 'denied' && c.ad_user_data === 'denied' && c.ad_personalization === 'denied'));
    assert(!(await events(t.p)).some(e => e.name === 'preconsent_test'));
    record(path + ': rejection persists; acceptance sends one tagged page view; ads stay denied; cookies expire within 180 days');
    // Exercise the existing form's failed and successful delivery paths safely.
    if (path === '/') {
      await t.p.locator('#h-name').fill('Tracking QA - no delivery');
      await t.p.locator('#h-phone').fill('+4915200000000');
      await t.p.locator('#h-website').fill('https://example.com');
      await t.p.locator('.uk-hero input[name="consent"]').check();
      await t.p.locator('.uk-hero button[type="submit"]').click(); await pause(1000);
      assert.equal((await events(t.p)).filter(e => e.name === 'generate_lead').length, 0);
      t.delivery.succeed = true;
      await t.p.locator('.uk-hero button[type="submit"]').click(); await pause(1800);
      const leads = (await events(t.p)).filter(e => e.name === 'generate_lead');
      assert.equal(leads.length, 1); assert.equal(leads[0].parameters.form_source, 'home-hero');
      assert(!JSON.stringify(leads).includes('Tracking QA')); assert(!JSON.stringify(leads).includes('4915200000000'));
      record('Existing website form: failure sends no lead event; simulated success sends one event without entered contact details', { deliveries: t.deliveries });
    }
    const other = await t.ctx.newPage();
    await other.goto(base + (path === '/' ? LP : '/'));
    await other.waitForFunction(() => window.DMAnalyticsConsent.isGranted());
    await t.p.getByText('Cookie-Einstellungen', { exact: true }).click();
    const before = t.requests.length;
    await choose(t.p, false); await pause(2000);
    assert.equal(await other.evaluate(() => window.DMAnalyticsConsent.isGranted()), false);
    assert.equal((await gaCookies(t.ctx)).length, 0);
    assert.equal(t.requests.length, before);
    assert.equal(await t.p.evaluate(() => window.DMAnalyticsConsent.track('after_withdrawal', {})), false);
    record(path + ': withdrawal stops Google requests, clears cookies and reaches the other page/tab');
    await t.ctx.close();
  }
  const now = Date.now(), json = x => JSON.stringify(x);
  const seeds = [
    { name: 'legacy consent', key: 'dm-eu-consent-v1', value: json({ analytics: true, ts: new Date().toISOString() }) },
    { name: 'expired consent', key: KEY, value: json({ analytics: true, version: '2026-09-11', ts: new Date(now - 181 * 86400000).toISOString() }) },
    { name: 'future timestamp', key: KEY, value: json({ analytics: true, version: '2026-09-11', ts: new Date(now + 86400000).toISOString() }) },
    { name: 'malformed consent', key: KEY, value: '{broken' },
    { name: 'wrong type', key: KEY, value: json({ analytics: 'true', version: '2026-09-11', ts: new Date().toISOString() }) },
  ];
  for (const s of seeds) {
    const t = await setup(s); await t.p.goto(base); await pause(500);
    assert.equal(t.requests.length, 0); assert.equal(await t.p.evaluate(() => window.DMAnalyticsConsent.read()), null);
    await t.p.getByRole('button', { name: 'Ablehnen', exact: true }).waitFor();
    record(s.name + ': asks again without tracking'); await t.ctx.close();
  }
  {
    const t = await setup();
    await t.ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } }); });
    await t.p.goto(base); await pause(500); assert.equal(t.requests.length, 0);
    await accepted(t); await t.p.reload(); await pause(800);
    assert.equal(await t.p.evaluate(() => window.DMAnalyticsConsent.isGranted()), false);
    assert.equal((await gaCookies(t.ctx)).length, 0);
    record('Blocked browser storage: choice lasts only on current page; reload returns to no tracking'); await t.ctx.close();
  }
  for (const width of [390, 1440]) for (const path of ['/', LP]) {
    const t = await setup(null, { width, height: width === 390 ? 844 : 900 });
    await t.p.goto(base + path); await t.p.getByRole('button', { name: 'Ablehnen', exact: true }).waitFor();
    const buttons = await t.p.getByRole('dialog').getByRole('button').evaluateAll(els => els.map(e => {
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      return { width: r.width, height: r.height, background: s.backgroundColor, color: s.color };
    }));
    assert.equal(buttons.length, 2); assert.deepEqual(buttons[0], buttons[1]); assert(buttons[0].height >= 44);
    assert.equal(await t.p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const stem = `/tmp/dm-consent-${path === '/' ? 'home' : 'campaign'}-${width}`;
    await t.p.screenshot({ path: stem + '.png' });
    await t.p.getByText('Welche Daten werden gespeichert?', { exact: true }).click();
    await t.p.screenshot({ path: stem + '-details.png' });
    const rect = await t.p.getByRole('dialog').boundingBox();
    assert(rect.y >= 0 && rect.x >= 0 && rect.x + rect.width <= width + 1);
    record(path + ': ' + width + 'px banner, equal buttons, accessible details and no horizontal overflow'); await t.ctx.close();
  }
  assert.deepEqual(errors, []);
  record('No browser JavaScript errors');
} catch (error) { results.push({ passed: false, error: error.stack }); process.exitCode = 1; console.error(error.message); }
finally {
  writeFileSync('/tmp/dm-consent-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, collectionIntercepted: true, results, errors }, null, 2));
  if (browser) await browser.close(); if (server) server.kill();
}
