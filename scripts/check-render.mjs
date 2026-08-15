#!/usr/bin/env node
/**
 * Prüft die gebaute Seite so, wie ein Besucher sie sieht — im Browser, nicht
 * im Quelltext.
 *
 * Warum es dieses Skript gibt:
 *
 * Am 15.08.2026 war digitalmovement.eu live, antwortete auf jede Datei mit
 * 200, hatte keinen Fehler in der Konsole und bestand jede Prüfung, die den
 * Quelltext ansieht. Auf einem Telefon waren trotzdem **32 Textblöcke
 * unsichtbar** — praktisch jede Überschrift unterhalb des ersten
 * Bildschirms. Ursache: die Seite wird vorgerendert, dabei landet
 * `style="opacity:0"` von framer-motion im HTML; wechselt die Komponente
 * nach dem Laden in einen anderen Zweig, schreibt diesen Wert niemand mehr
 * zurück. Im Quelltext ist davon nichts zu sehen. Siehe src/lib/Reveal.tsx.
 *
 * Drei Prüfungen, je Bildschirmbreite:
 *
 *   1. Kein sichtbarer Textblock steht auf opacity 0, nachdem die Seite
 *      einmal durchgescrollt wurde.
 *   2. Kein seitliches Scrollen (scrollWidth == innerWidth).
 *   3. Auf dem Desktop: keine H2/H3 über zwei Zeilen.
 *
 * Aufruf:  node scripts/check-render.mjs [URL]
 * Ohne URL wird dist/ selbst auf einem freien Port ausgeliefert.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Breiten, gegen die geprüft wird. `desktop` schaltet die Zeilenprüfung an. */
const VIEWPORTS = [
  { name: "Telefon", width: 390, height: 844, desktop: false },
  { name: "Desktop", width: 1440, height: 900, desktop: true },
  { name: "Desktop breit", width: 1920, height: 1000, desktop: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const problems = [];

/* ---------- Seite ausliefern ---------- */
let server = null;
let base = process.argv[2];

if (!base) {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("check-render: FEHLER — dist/index.html fehlt. Erst bauen.");
    process.exit(1);
  }
  const port = 4700 + Math.floor(process.hrtime()[1] % 200);
  server = spawn(
    process.execPath,
    [join(ROOT, "node_modules", "vite", "bin", "vite.js"), "preview", "--port", String(port), "--strictPort"],
    { cwd: ROOT, stdio: "ignore", env: { ...process.env, NODE_ENV: "development" } },
  );
  base = `http://localhost:${port}/`;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(base);
      if (res.ok) break;
    } catch {
      /* noch nicht da */
    }
    await sleep(250);
  }
}

function stop() {
  if (server) server.kill();
}

/* ---------- messen ---------- */
const browser = await chromium.launch({ executablePath: CHROME });

try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(base, { waitUntil: "networkidle" });

    const result = await page.evaluate(async (isDesktop) => {
      const nap = (ms) => new Promise((r) => setTimeout(r, ms));

      // Einmal durch die ganze Seite — Einblend-Animationen hängen am Scrollen.
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await nap(110);
      }
      // Waagerechte Schieber ebenfalls durchfahren: was seitlich aus dem Bild
      // geschoben ist, hat noch nie im Sichtfeld gestanden und darf
      // durchsichtig sein — geprüft wird, ob es sichtbar WIRD.
      //
      // Der Schieber muss dafür senkrecht im Bild stehen. Ohne das
      // scrollIntoView schiebt man Karten in einen Abschnitt, der gar nicht
      // zu sehen ist — nichts blendet ein, und die Prüfung meldet einen
      // Fehler, den es nicht gibt.
      for (const track of document.querySelectorAll(".snap-x")) {
        track.scrollIntoView({ block: "center", behavior: "instant" });
        await nap(400);
        for (const card of track.children) {
          track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "instant" });
          await nap(500);
        }
      }
      await nap(900);

      const invisible = [];
      for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,span,a,button")) {
        const text = el.textContent.trim();
        if (text.length < 4) continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.width === 0) continue;
        // Nur das Element selbst und seine Kette bis zum Abschnitt ansehen.
        let node = el;
        let dead = false;
        while (node && node !== document.body) {
          if (getComputedStyle(node).opacity === "0") {
            dead = true;
            break;
          }
          node = node.parentElement;
        }
        if (dead) invisible.push(text.slice(0, 60));
      }

      const longHeadings = [];
      if (isDesktop) {
        for (const el of document.querySelectorAll("h2, h3")) {
          const r = el.getBoundingClientRect();
          if (r.height === 0) continue;
          const cs = getComputedStyle(el);
          const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.1;
          const lines = Math.round(r.height / lh);
          if (lines > 2) longHeadings.push(`${lines} Zeilen: ${el.textContent.trim().slice(0, 50)}`);
        }
      }

      return {
        invisible: [...new Set(invisible)],
        longHeadings,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        headings: document.querySelectorAll("h2, h3").length,
      };
    }, vp.desktop);

    /* Eine Prüfung, die nichts findet, hat nichts geprüft — dieselbe Falle
       wie in publish.mjs. Diese Startseite hat rund 28 Überschriften. */
    if (result.headings < 10) {
      problems.push(`${vp.name}: nur ${result.headings} Überschriften gefunden — die Prüfung selbst ist kaputt.`);
    }
    if (result.invisible.length) {
      problems.push(
        `${vp.name}: ${result.invisible.length} sichtbare Textblöcke stehen auf opacity 0:\n    ` +
          result.invisible.slice(0, 12).join("\n    "),
      );
    }
    if (result.scrollWidth > result.innerWidth) {
      problems.push(`${vp.name}: seitliches Scrollen — ${result.scrollWidth} statt ${result.innerWidth} px.`);
    }
    if (result.longHeadings.length) {
      problems.push(
        `${vp.name}: ${result.longHeadings.length} Überschriften über zwei Zeilen:\n    ` +
          result.longHeadings.join("\n    "),
      );
    }

    console.log(
      `check-render: ${vp.name} (${vp.width}px) — ${result.headings} Überschriften, ` +
        `${result.invisible.length} unsichtbar, ${result.longHeadings.length} zu lang`,
    );

    await page.close();
  }
} finally {
  await browser.close();
  stop();
}

if (problems.length) {
  console.error(`check-render: FEHLER\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log("check-render: bestanden.");
