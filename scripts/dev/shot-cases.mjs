import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "/private/tmp/claude-501/-Users-raoulito-digital-movement-uk/e8c3bd6a-0736-4c1b-9fad-59ae7b2e560c/scratchpad/shots";
mkdirSync(OUT, { recursive: true });
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:5199/";

const browser = await chromium.launch({ executablePath: CHROME });

/* ---- Desktop ---- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  const nap = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await nap(90); }
  await nap(800);
});

const frames = await page.$$("#cases iframe");
console.log("desktop frames:", frames.length);
for (let i = 0; i < frames.length; i++) {
  const card = await frames[i].evaluateHandle((el) => el.closest("article") || el.closest("li") || el.parentElement.parentElement.parentElement);
  await card.asElement().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await card.asElement().screenshot({ path: `${OUT}/desk-${i}.png` });
}
await page.close();

/* ---- Telefon ---- */
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await m.goto(url, { waitUntil: "networkidle" });
await m.evaluate(async () => {
  const nap = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await nap(90); }
  const sec = document.querySelector("#cases");
  sec.scrollIntoView({ block: "center", behavior: "instant" });
  await nap(1200);
});
const track = await m.$("#cases .snap-x");
if (track) {
  const n = await track.evaluate((t) => t.children.length);
  console.log("phone slides:", n);
  for (let i = 0; i < n; i++) {
    await track.evaluate((t, idx) => {
      const c = t.children[idx];
      t.scrollTo({ left: c.offsetLeft - t.offsetLeft, behavior: "instant" });
    }, i);
    await m.waitForTimeout(1800);
    await m.screenshot({ path: `${OUT}/phone-${i}.png` });
  }
} else {
  await m.screenshot({ path: `${OUT}/phone-section.png`, fullPage: false });
  console.log("kein .snap-x im Abschnitt gefunden");
}
await m.close();
await browser.close();
console.log("fertig ->", OUT);
