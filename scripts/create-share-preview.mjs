#!/usr/bin/env node
// Editable HTML/CSS share card, adapted from the NZ site's og-preview.html.
// Render the original team photos with the same circular crops as the homepage.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = new URL("../", import.meta.url);
const asset = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, root))).toString("base64")}`;
const [background, logo, johannes, raoul, font] = await Promise.all([
  asset("public/video/hero/mountain-poster.jpg", "image/jpeg"),
  asset("public/brand/logo-color-negative.svg", "image/svg+xml"),
  asset("public/brand/team/johannes-kaluc.jpg", "image/jpeg"),
  asset("public/brand/team/raoul-mueller.jpg", "image/jpeg"),
  asset("node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", "font/woff2"),
]);

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url('${font}');font-weight:200 800}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{position:relative;background:#1a0e2e;color:#fff;font-family:Manrope,Arial,sans-serif}
.background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(26,14,46,.97) 0%,rgba(26,14,46,.78) 46%,rgba(26,14,46,.12) 100%),linear-gradient(0deg,rgba(26,14,46,.86),transparent 65%)}
.logo{position:absolute;left:47px;top:61px;width:314px}
h1{position:absolute;left:64px;top:176px;margin:0;font-size:74px;font-weight:650;line-height:1.13;letter-spacing:-3.8px}
h1 span{color:#ffa38e}
.description{position:absolute;left:66px;top:449px;margin:0;font-size:28px;font-weight:450;letter-spacing:-.5px}
.eyebrow{position:absolute;left:66px;bottom:53px;margin:0;font-size:14px;letter-spacing:2.4px;text-transform:uppercase;color:#f2e5ed}
.team{position:absolute;right:66px;top:356px;width:346px;text-align:center}
.portraits{display:flex;gap:18px;justify-content:center}
.portrait{width:164px;height:164px;border:3px solid #fff;border-radius:50%;overflow:hidden;background:#eee8ed;box-shadow:0 4px 28px #140a2333}
.portrait img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.johannes img{object-position:center 29%;transform:scale(1.65);transform-origin:50% 29%}
.names{font-size:23px;font-weight:550;margin:14px 0 0;letter-spacing:-.5px}
</style></head><body>
<img class="background" src="${background}" alt=""><div class="shade"></div>
<img class="logo" src="${logo}" alt="Digital Movement">
<h1>Mehr Anfragen.<br>Echte Ergebnisse.<br><span>Weniger Kosten.</span></h1>
<p class="description">SEO · Google Ads · Websites</p>
<p class="eyebrow">Digitales Marketing für Ihr Unternehmen</p>
<div class="team"><div class="portraits"><div class="portrait johannes"><img src="${johannes}" alt="Johannes Kaluc"></div><div class="portrait"><img src="${raoul}" alt="Raoul Müller"></div></div><p class="names">Johannes &amp; Raoul</p></div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  for (const [scale, suffix] of [[1, ""], [0.5, "-thumbnail"]]) {
    const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: scale });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const path = fileURLToPath(new URL(`public/brand/digital-movement-johannes-raoul-20260911${suffix}.jpg`, root));
    await page.screenshot({ path, type: "jpeg", quality: 94 });
    console.log(`Share preview: ${1200 * scale} × ${630 * scale}${suffix}`);
    await context.close();
  }
} finally {
  await browser.close();
}
