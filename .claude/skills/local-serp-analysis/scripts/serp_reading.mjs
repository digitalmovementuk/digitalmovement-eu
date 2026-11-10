#!/usr/bin/env node
// Google SERP reading with a device location. Run on your OWN machine only:
// Google answers cloud and datacenter IPs with /sorry straight away.
//
// One run = one package = one measuring point, max 10 queries, 45–90 s apart.
//
//   node serp_reading.mjs --point frintrop --q "bestatter" --q "bestattung"
//   node serp_reading.mjs --lat 51.4776 --lng 6.9083 --label "Essen-Frintrop" --expect Frintrop,Essen --q "bestatter"
//
// Options:
//   --out <dir>        output folder (default ./serp-readings/<date>/<point>)
//   --profile <dir>    browser profile (default ~/.serp-reading-profile)
//   --bundled          use Playwright's Chromium instead of installed Google Chrome
//   --headless         run without a window (more likely to be blocked)
//   --min-wait/--max-wait <s>  pause between queries (default 45 / 90)
//
// The script only collects: screenshot, HTML, page text, footer, result links.
// Claude reads the output and writes the reading log (see references/browser_reading.md).
// It never solves or bypasses a CAPTCHA. On /sorry it stops and saves.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const POINTS = {
  frintrop: { label: 'Essen-Frintrop', lat: 51.4776, lng: 6.9083, expect: ['Frintrop', 'Essen'] },
  'essen-mitte': { label: 'Essen-Mitte', lat: 51.4569, lng: 7.0115, expect: ['Essen'] },
  oberhausen: { label: 'Oberhausen', lat: 51.4696, lng: 6.8514, expect: ['Oberhausen'] },
  muelheim: { label: 'Mülheim an der Ruhr', lat: 51.4273, lng: 6.8829, expect: ['Mülheim'] },
  bottrop: { label: 'Bottrop', lat: 51.5216, lng: 6.9292, expect: ['Bottrop'] },
  gelsenkirchen: { label: 'Gelsenkirchen', lat: 51.511, lng: 7.096, expect: ['Gelsenkirchen'] },
};
const MAX_QUERIES = 10;

// ---- args
const argv = process.argv.slice(2);
const opt = { q: [] };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => argv[++i];
  if (a === '--q') opt.q.push(next());
  else if (a === '--bundled' || a === '--headless') opt[a.slice(2)] = true;
  else if (a.startsWith('--')) opt[a.slice(2)] = next();
}
let point;
if (opt.point) {
  point = POINTS[opt.point];
  if (!point) fail(`Unknown point "${opt.point}". Known: ${Object.keys(POINTS).join(', ')}`);
  point = { key: opt.point, ...point };
} else if (opt.lat && opt.lng) {
  const label = opt.label || `${opt.lat},${opt.lng}`;
  point = {
    key: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label, lat: Number(opt.lat), lng: Number(opt.lng),
    expect: (opt.expect || label).split(',').map((s) => s.trim()),
  };
} else fail('Give --point <key> or --lat/--lng.');
if (!opt.q.length) fail('Give at least one --q "<keyword>".');
if (opt.q.length > MAX_QUERIES) fail(`${opt.q.length} queries. Max ${MAX_QUERIES} per package. Split into packages.`);
const minWait = Number(opt['min-wait'] ?? 45);
const maxWait = Number(opt['max-wait'] ?? 90);

function fail(msg) { console.error(msg); process.exit(1); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const berlin = (d, part) => new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Berlin',
  ...(part === 'date' ? { year: 'numeric', month: '2-digit', day: '2-digit' } : { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
}).format(d);
const slug = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- playwright (works with a global install via NODE_PATH, or playwright-core)
const require = createRequire(import.meta.url);
let pw;
for (const name of ['playwright', 'playwright-core']) {
  try { pw = require(name); break; } catch {}
}
if (!pw) fail('Playwright not found. Install it: npm i -D playwright');

const today = berlin(new Date(), 'date');
const outDir = opt.out || join(process.cwd(), 'serp-readings', today, point.key);
mkdirSync(outDir, { recursive: true });
const profile = opt.profile || join(homedir(), '.serp-reading-profile');

const ctx = await pw.chromium.launchPersistentContext(profile, {
  ...(opt.bundled ? {} : { channel: 'chrome' }),
  headless: !!opt.headless,
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
  geolocation: { latitude: point.lat, longitude: point.lng, accuracy: 20 },
  permissions: ['geolocation'],
  viewport: { width: 1366, height: 900 },
});
await ctx.grantPermissions(['geolocation'], { origin: 'https://www.google.de' });
const page = ctx.pages()[0] || (await ctx.newPage());

const isBlocked = async () => {
  if (/\/sorry\//.test(page.url())) return true;
  const t = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 3000) : '');
  return /ungewöhnlichen Datenverkehr|unusual traffic|nicht ein Roboter|not a robot/i.test(t);
};

async function handleConsent() {
  const btn = page.getByRole('button', { name: /Alle ablehnen|Reject all/i }).first();
  if (await btn.isVisible({ timeout: 2500 }).catch(() => false)) {
    await btn.click();
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await sleep(1500);
  }
}

let locationRefreshed = false;
const results = [];

for (let i = 0; i < opt.q.length; i++) {
  const keyword = opt.q[i];
  const id = `${today}_${point.key}_${slug(keyword)}`;
  const now = new Date();
  const url = `https://www.google.de/search?q=${encodeURIComponent(keyword)}&hl=de&gl=de`;
  console.log(`[${i + 1}/${opt.q.length}] ${keyword} @ ${point.label}`);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await handleConsent();
  if (await isBlocked()) {
    await page.screenshot({ path: join(outDir, `${id}_BLOCKED.png`) });
    const line = { reading_id: id, keyword, point: point.key, status: 'blocked', url: page.url() };
    appendFileSync(join(outDir, 'readings.jsonl'), JSON.stringify(line) + '\n');
    console.error('Google shows /sorry or a CAPTCHA. Package stopped. Do not retry for several hours.');
    results.push(line);
    break;
  }

  if (!locationRefreshed) {
    const upd = page.getByText(/Standort aktualisieren|Update location/i).first();
    if (await upd.isVisible({ timeout: 2000 }).catch(() => false)) {
      await upd.click().catch(() => {});
      await sleep(3000);
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    locationRefreshed = true;
  }

  await sleep(2500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1200);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const footEl = document.querySelector('#footcnt, #fbar, footer');
    const footer = (footEl && footEl.innerText.trim()) || text.slice(-800);
    const organic = [...document.querySelectorAll('#search a:has(h3), #rso a:has(h3)')]
      .map((a) => ({ title: a.querySelector('h3').innerText.trim(), href: a.href }));
    const ads = [...document.querySelectorAll('#tads [data-text-ad] a[href], #bottomads [data-text-ad] a[href]')]
      .filter((a) => a.innerText.trim())
      .map((a) => ({ text: a.innerText.trim().split('\n')[0], href: a.href }));
    const seen = new Set();
    const dedupe = (arr) => arr.filter((x) => !seen.has(x.href) && seen.add(x.href));
    return { text, footer, organic: dedupe(organic), ads: dedupe(ads) };
  });

  const f = data.footer;
  const source = /IP-Adresse|IP address/i.test(f) ? 'ip'
    : /Aktivitäten|activity/i.test(f) ? 'activity'
    : /Gerät|präzise|genaue|precise|device/i.test(f) ? 'device' : 'unknown';
  const matches = point.expect.some((e) => f.includes(e));

  await page.screenshot({ path: join(outDir, `${id}.png`), fullPage: true });
  writeFileSync(join(outDir, `${id}.html`), await page.content());
  writeFileSync(join(outDir, `${id}.txt`), data.text);
  const line = {
    reading_id: id, date: today, time: berlin(now, 'time'), keyword,
    point: point.key, label: point.label, lat: point.lat, lng: point.lng,
    tool: 'browser-script', signed_in: 'no',
    footer_text: f.replace(/\s+/g, ' ').trim(),
    location_source_guess: source, footer_matches_point: matches,
    verified: matches && source === 'device' ? 'yes' : 'check',
    organic_links: data.organic.length, ad_links: data.ads.length, status: 'ok',
  };
  writeFileSync(join(outDir, `${id}.json`), JSON.stringify({ ...line, organic: data.organic, ads: data.ads }, null, 2));
  appendFileSync(join(outDir, 'readings.jsonl'), JSON.stringify(line) + '\n');
  results.push(line);
  console.log(`  footer: ${line.footer_text.slice(0, 140)}`);
  console.log(`  source=${source} matches=${matches} verified=${line.verified} organic=${data.organic.length} ads=${data.ads.length}`);

  if (i < opt.q.length - 1) {
    const s = minWait + Math.random() * (maxWait - minWait);
    console.log(`  waiting ${Math.round(s)} s`);
    await sleep(s * 1000);
  }
}

await ctx.close();
console.log(`\nSaved to ${outDir}`);
const bad = results.filter((r) => r.status === 'blocked' || r.verified !== 'yes');
if (bad.length) console.log(`${bad.length} reading(s) need a manual footer check or were blocked. Do not use them unverified.`);
process.exit(results.some((r) => r.status === 'blocked') ? 2 : 0);
