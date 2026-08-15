#!/usr/bin/env node
/**
 * Baut aus jedem Kundenprojekt eine eingefrorene Kopie des Startbereichs,
 * die auf unserer eigenen Adresse liegt: public/cases/<slug>/{desktop,phone}/
 *
 * Warum eingefroren und nicht die Kundenseite selbst im iframe:
 *
 *   1. Ein iframe auf eine fremde Adresse ist eine Datenweitergabe an Dritte,
 *      bevor der Besucher irgendetwas angeklickt hat. Auf einer deutschen
 *      Seite bräuchte das ein Einwilligungsbanner (§ 25 TDDDG).
 *   2. Die Kundenseiten zeigen ihre eigenen Cookie-Fenster — genau das, was
 *      hier nicht passieren soll.
 *   3. Fremde Seiten dürfen das Einbetten jederzeit sperren
 *      (X-Frame-Options), dann steht die Erfolgsgeschichte leer da.
 *
 * Die Kopie enthält kein JavaScript, keine Zählpixel und keine fremden
 * Adressen: Bilder, Videos, Schriften und CSS liegen daneben im Ordner.
 * Der Besucher lädt ausschließlich von digitalmovement.eu.
 *
 * Aufruf:  node scripts/build-case-heroes.mjs [slug ...]
 */

import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "cases");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PROJECTS = resolve(ROOT, "..", "..", "..");

/** Größte Datei, die mitkopiert wird. Darüber: Video fällt auf sein Standbild
 *  zurück. Sechs Startbereiche mit je einem 20-MB-Video wären sonst die
 *  schwerste Seite, die wir je ausgeliefert haben. */
const MAX_ASSET_BYTES = 6 * 1024 * 1024;

/** Wie viel bewegtes Bild ein Kunde insgesamt beisteuern darf (beide Breiten
 *  zusammen). ADDRESSBALI brachte im ersten Lauf allein 29 MB mit — für eine
 *  Kachel, die 600 px breit ist. Was darüber liegt, fällt auf das Standbild
 *  zurück. */
const VIDEO_BUDGET_BYTES = 5 * 1024 * 1024;
let videoBudget = VIDEO_BUDGET_BYTES;

/** Ein zu schweres Video wird verkleinert, nicht weggeworfen.
 *
 *  Der Startbereich von Fantastic Finish bringt ein 15-MB-Video mit. Beim
 *  ersten Lauf fiel es auf sein Standbild zurück — die Kachel stand still,
 *  während alle anderen liefen. Gezeigt werden soll aber der erste
 *  Bildschirm des Kunden so, wie er sich bewegt.
 *
 *  Deshalb: erst neu berechnen (schmaler, kürzer, ohne Ton), und nur wenn
 *  auch das nicht in den Rahmen passt, bleibt das Standbild.
 */
const TRANSCODE_SECONDS = 12;
const TRANSCODE_WIDTH = 1280;

function findFfmpeg() {
  const fromPath = spawnSync("which", ["ffmpeg"], { encoding: "utf8" });
  if (fromPath.status === 0 && fromPath.stdout.trim()) return fromPath.stdout.trim();
  // macOS liefert kein ffmpeg mit; imageio-ffmpeg bringt eine eigene Fassung.
  const viaPython = spawnSync(
    "python3",
    ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"],
    { encoding: "utf8" },
  );
  if (viaPython.status === 0 && viaPython.stdout.trim()) return viaPython.stdout.trim();
  return null;
}
const FFMPEG = findFfmpeg();

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

/**
 * Quelle je Kunde. `dir` = fertiger Build im Dateisystem (wird lokal
 * ausgeliefert), `url` = die Live-Seite (wo es kein lokales Projekt gibt).
 */
const CASES = [
  {
    slug: "cex",
    url: "https://cex.koeln/",
    note: "WordPress — die Quelle ist die Live-Seite, es gibt keinen lokalen Build.",
  },
  {
    slug: "azura-living-bali",
    dir: join(PROJECTS, "Web Design Projects", "Azura Living Bali Static", "public"),
  },
  {
    slug: "addressbali",
    url: "https://addressbali.com/",
    note: "Next.js — Live-Seite, weil der lokale Build einen Server braucht.",
  },
  {
    slug: "cunos",
    dir: join(PROJECTS, "Web Design Projects", "Cunos", "Homepage 260513", "dist"),
  },
  {
    slug: "fantastic-finish",
    dir: join(PROJECTS, "Web Design Projects", "Fantastic Finish Homepage", "dist"),
  },
];

/* ────────────── kleiner statischer Server für lokale Builds ────────────── */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

function serveDir(dir) {
  return new Promise((ok) => {
    const server = createServer((req, res) => {
      const clean = decodeURIComponent(req.url.split("?")[0]);
      let file = join(dir, clean);
      if (clean.endsWith("/")) file = join(file, "index.html");
      /* Manche Builds erwarten einen Unterpfad (Fantastic Finish liegt live
         unter /fantastic_finish/). Findet sich die Datei nicht, wird der
         erste Pfadabschnitt weggelassen und noch einmal gesucht. */
      if (!existsSync(file)) {
        const parts = clean.split("/").filter(Boolean);
        if (parts.length > 1) file = join(dir, parts.slice(1).join("/"));
      }
      /* Für alles mit Dateiendung gilt: nicht da ist nicht da. Früher fiel
         der Server hier auf index.html zurück — dann bekam der Browser HTML
         als CSS und als JavaScript geliefert, die Seite blieb leer, und der
         Lauf meldete trotzdem einen Erfolg. */
      if (!existsSync(file) && !extname(clean)) file = join(dir, "index.html");
      try {
        const body = readFileSync(file);
        res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404).end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => ok({ server, base: `http://127.0.0.1:${server.address().port}/` }));
  });
}

/* ────────────── Seite im Browser einfrieren ────────────── */

/**
 * Läuft IM Browser. Räumt auf, schneidet auf den Startbereich zu und gibt
 * das HTML samt der Liste aller noch gebrauchten Adressen zurück.
 */
const FREEZE = (viewportHeight) => {
  const doc = document;

  /* 1. Alles wegnehmen, was der Besucher hier nicht sehen soll. */
  const KILL_WORDS = /cookie|consent|cmplz|borlabs|usercentrics|gdpr|datenschutz-hinweis|cmp-/i;
  const KILL_SELECTORS = [
    "script",
    "noscript",
    "iframe",
    'link[rel="preload"][as="script"]',
    "#cmplz-cookiebanner-container",
    ".cmplz-cookiebanner",
    "#usercentrics-root",
    "#BorlabsCookieBox",
    "[data-nosnippet][role='dialog']",
  ];
  for (const sel of KILL_SELECTORS) doc.querySelectorAll(sel).forEach((el) => el.remove());

  // Alles, was fest über der Seite klebt und nach Einwilligung klingt.
  for (const el of [...doc.body.querySelectorAll("div, section, aside, dialog")]) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    const text = (el.textContent || "").slice(0, 400);
    const marker = `${el.id} ${el.className}`;
    if (KILL_WORDS.test(text) || KILL_WORDS.test(marker)) el.remove();
  }

  /* 2. Auf den Startbereich zuschneiden: alles entfernen, was komplett
        unterhalb des ersten Bildschirms beginnt. Dabei den tiefsten
        Wrapper suchen, damit nicht nur ein einziges <div id="root">
        übrig bleibt. */
  let holder = doc.body;
  while (holder.children.length === 1 && holder.children[0].tagName !== "HEADER") {
    const only = holder.children[0];
    if (!["DIV", "MAIN", "SECTION"].includes(only.tagName)) break;
    holder = only;
  }
  for (const child of [...holder.children]) {
    const r = child.getBoundingClientRect();
    const cs = getComputedStyle(child);
    if (cs.position === "fixed" || cs.position === "sticky") continue;
    if (r.top >= viewportHeight) child.remove();
  }

  /* 3. Die Seite darf im iframe nicht scrollen und nichts nachladen. */
  doc.documentElement.style.overflow = "hidden";
  doc.body.style.overflow = "hidden";
  doc.querySelectorAll("[loading]").forEach((el) => el.removeAttribute("loading"));
  doc.querySelectorAll("a").forEach((a) => {
    a.setAttribute("tabindex", "-1");
    a.removeAttribute("href");
  });
  doc.querySelectorAll("video").forEach((v) => {
    v.setAttribute("autoplay", "");
    v.setAttribute("muted", "");
    v.setAttribute("loop", "");
    v.setAttribute("playsinline", "");
    v.removeAttribute("controls");
  });

  /* 4. Jede Adresse im Dokument auf die absolute Form bringen und dabei
        einsammeln. Absolut, weil danach in Node Zeichenkette gegen
        Zeichenkette getauscht wird: stünde im HTML weiter „/media/hero.mp4",
        fände die Ersetzung nichts und das Video liefe ins Leere. */
  const urls = new Set();
  const abs = (u) => {
    try {
      const x = new URL(u, location.href);
      return x.protocol === "http:" || x.protocol === "https:" ? x.href : null;
    } catch {
      return null;
    }
  };

  for (const el of doc.querySelectorAll("img, video, source, use, image")) {
    for (const attr of ["src", "poster", "href", "xlink:href"]) {
      const v = el.getAttribute(attr);
      if (!v || v.startsWith("data:")) continue;
      const a = abs(v);
      if (a) {
        el.setAttribute(attr, a);
        urls.add(a);
      }
    }
    const srcset = el.getAttribute("srcset");
    if (srcset) {
      const rebuilt = [];
      for (const part of srcset.split(",")) {
        const bits = part.trim().split(/\s+/);
        const a = abs(bits[0]);
        if (a) {
          urls.add(a);
          rebuilt.push([a, ...bits.slice(1)].join(" "));
        }
      }
      el.setAttribute("srcset", rebuilt.join(", "));
    }
  }
  for (const el of doc.querySelectorAll("[style]")) {
    const style = el.getAttribute("style");
    if (!style.includes("url(")) continue;
    el.setAttribute(
      "style",
      style.replace(/url\((['"]?)([^'")]+)\1\)/g, (whole, _q, raw) => {
        if (raw.startsWith("data:")) return whole;
        const a = abs(raw);
        if (!a) return whole;
        urls.add(a);
        return 'url("' + a + '")';
      }),
    );
  }

  return { urls: [...urls] };
};

/**
 * Laeuft IM Browser, nachdem alles heruntergeladen ist: setzt die lokalen
 * Pfade ein und ersetzt jedes Video, dessen Datei nicht mitkam, durch sein
 * Standbild. Ein <video> ohne Quelle ist im iframe eine schwarze Flaeche —
 * genau dort, wo die Arbeit des Kunden zu sehen sein soll.
 */
const RELINK = ({ pairs, kept }) => {
  const local = new Map(pairs);
  const keptSet = new Set(kept);
  const doc = document;

  for (const el of doc.querySelectorAll("[src], [poster], [href], [srcset]")) {
    for (const attr of ["src", "poster", "href", "xlink:href"]) {
      const v = el.getAttribute(attr);
      if (v && local.has(v)) el.setAttribute(attr, local.get(v));
    }
    const srcset = el.getAttribute("srcset");
    if (srcset) {
      const rebuilt = srcset
        .split(",")
        .map((part) => {
          const bits = part.trim().split(/\s+/);
          return local.has(bits[0]) ? [local.get(bits[0]), ...bits.slice(1)].join(" ") : null;
        })
        .filter(Boolean)
        .join(", ");
      if (rebuilt) el.setAttribute("srcset", rebuilt);
      else el.removeAttribute("srcset");
    }
  }

  for (const el of doc.querySelectorAll("[style]")) {
    const style = el.getAttribute("style");
    if (!style.includes("url(")) continue;
    el.setAttribute(
      "style",
      style.replace(/url\((['"]?)([^'")]+)\1\)/g, (whole, _q, raw) =>
        local.has(raw) ? 'url("' + local.get(raw) + '")' : whole,
      ),
    );
  }

  /* Ein <template> ist ein eigenes Dokumentfragment — querySelectorAll im
     Hauptbaum sieht nichts davon, und ein darin verstecktes <a href> blieb
     im ersten Lauf als einzige fremde Adresse in der Kopie stehen. */
  doc.querySelectorAll("template").forEach((t) => t.remove());

  /* Kommentare rausnehmen. Die Azura-Kopie schleppte 800 kB auskommentiertes
     Markup mit, darin eine WhatsApp-Adresse — inaktiv, aber die Prüfung
     „keine fremde Adresse mehr im Dokument" schlug darauf an. */
  const walker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  doc.querySelectorAll("a[href]").forEach((a) => a.removeAttribute("href"));

  let posterFallbacks = 0;
  for (const video of [...doc.querySelectorAll("video")]) {
    const has = (v) => Boolean(v) && keptSet.has(v);
    const ownSource = has(video.getAttribute("src"));
    const innerSource = [...video.querySelectorAll("source")].some((s) => has(s.getAttribute("src")));
    if (ownSource || innerSource) continue;
    const poster = video.getAttribute("poster");
    const stand = doc.createElement("div");
    stand.setAttribute("class", video.getAttribute("class") || "");
    stand.setAttribute(
      "style",
      (video.getAttribute("style") || "") +
        ";background-size:cover;background-position:center;" +
        (has(poster) ? 'background-image:url("' + poster + '")' : "background-color:#111"),
    );
    video.replaceWith(stand);
    posterFallbacks++;
  }

  // Was jetzt noch nach aussen zeigt, kann ohnehin nicht geladen werden — und
  // darf vor allem keine Anfrage an eine fremde Adresse ausloesen.
  let orphans = 0;
  for (const el of doc.querySelectorAll("[src], [poster], [srcset]")) {
    for (const attr of ["src", "poster", "srcset"]) {
      const v = el.getAttribute(attr);
      if (!v || v.startsWith("data:") || v.startsWith("../a/")) continue;
      el.removeAttribute(attr);
      orphans++;
    }
  }

  return { posterFallbacks, orphans, html: "<!doctype html>\n" + doc.documentElement.outerHTML };
};

/* ────────────── ein Kunde, eine Breite ────────────── */

async function freezeOne(browser, entry, base, vp, fresh) {
  /* Beide Breiten teilen sich einen Dateiordner: Telefon und Desktop laden
     zum großen Teil dieselben Bilder und dasselbe Video. Getrennt kostete
     jeder Kunde das Doppelte. */
  /* Das Budget gilt je Breite: Telefon und Desktop laden verschiedene
     Videodateien, und wer zuerst kommt, soll dem anderen nichts wegnehmen. */
  videoBudget = VIDEO_BUDGET_BYTES;
  const slugDir = join(OUT, entry.slug);
  if (fresh) rmSync(slugDir, { recursive: true, force: true });
  const dir = join(slugDir, vp.name);
  const assetDir = join(slugDir, "a");
  mkdirSync(dir, { recursive: true });
  mkdirSync(assetDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    // Deutsch, damit deutsche Kundenseiten nicht in eine andere Sprache
    // umschalten.
    locale: "de-DE",
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle", timeout: 90_000 });
  // Einblende-Animationen zu Ende laufen lassen.
  await page.waitForTimeout(2500);

  const { urls } = await page.evaluate(FREEZE, vp.height);

  /* Stylesheets einsammeln und die darin genannten Dateien mitnehmen. */
  const sheets = await page.evaluate(async () => {
    const parts = [];
    for (const link of [...document.querySelectorAll('link[rel="stylesheet"]')]) {
      try {
        const res = await fetch(link.href);
        parts.push({ href: link.href, css: await res.text() });
      } catch {
        parts.push({ href: link.href, css: "" });
      }
      link.remove();
    }
    for (const style of [...document.querySelectorAll("style")]) {
      parts.push({ href: location.href, css: style.textContent || "" });
      style.remove();
    }
    return parts;
  });

  /* Alles herunterladen und lokal ablegen. */
  const map = new Map(); // absolute URL -> lokaler Pfad
  const download = async (url) => {
    if (map.has(url)) return map.get(url);
    try {
      const res = await context.request.get(url, { timeout: 45_000 });
      if (!res.ok()) return null;
      const body = await res.body();
      const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(new URL(url).pathname) ||
        (res.headers()["content-type"] || "").startsWith("video/");
      let data = body;
      let forcedExt = null;
      if (isVideo) {
        if (data.length > videoBudget) {
          const smaller = shrinkVideo(data, url);
          if (smaller && smaller.length <= videoBudget) {
            console.log(
              `    Video verkleinert ${(data.length / 1e6).toFixed(1)} → ${(smaller.length / 1e6).toFixed(1)} MB: ${url.slice(-48)}`,
            );
            data = smaller;
            forcedExt = ".mp4";
          } else {
            console.log(
              `    Standbild statt Video (${(data.length / 1e6).toFixed(1)} MB, Rest ${(videoBudget / 1e6).toFixed(1)} MB): ${url.slice(-48)}`,
            );
            return null;
          }
        }
        videoBudget -= data.length;
      }
      if (data.length > MAX_ASSET_BYTES) {
        console.log(`    übersprungen (${(data.length / 1e6).toFixed(1)} MB): ${url.slice(0, 80)}`);
        return null;
      }
      const name =
        createHash("sha1").update(url).digest("hex").slice(0, 12) +
        (forcedExt || extname(new URL(url).pathname) || guessExt(res.headers()["content-type"]));
      writeFileSync(join(assetDir, name), data);
      map.set(url, `../a/${name}`);
      return `../a/${name}`;
    } catch {
      return null;
    }
  };

  // CSS zuerst: darin stecken Schriften und Hintergrundbilder.
  const cssUrls = new Set();
  for (const sheet of sheets) {
    for (const m of sheet.css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
      if (m[2].startsWith("data:")) continue;
      try {
        cssUrls.add(new URL(m[2], sheet.href).href);
      } catch {
        /* kaputte Angabe, ignorieren */
      }
    }
  }
  for (const url of [...cssUrls, ...urls]) await download(url);

  /* CSS umschreiben und zusammenfügen. */
  let css = "";
  for (const sheet of sheets) {
    let text = sheet.css;
    text = text.replace(/url\((['"]?)([^'")]+)\1\)/g, (whole, _q, raw) => {
      if (raw.startsWith("data:")) return whole;
      let absUrl;
      try {
        absUrl = new URL(raw, sheet.href).href;
      } catch {
        return whole;
      }
      const local = map.get(absUrl);
      return local ? `url("${local}")` : "url(about:blank)";
    });
    css += `\n/* ${sheet.href} */\n${text}\n`;
  }

  /* Lokale Pfade einsetzen, Videos ohne Datei auf ihr Standbild
     zurückfallen lassen — und zwar im Browser, damit die Ersetzung am
     echten Baum passiert und nicht an einer Zeichenkette. */
  const relink = await page.evaluate(RELINK, { pairs: [...map], kept: [...map.values()] });

  const head = `<meta charset="utf-8"><meta name="robots" content="noindex,nofollow">
<title>${entry.slug} — Startbereich</title>
<style>html,body{margin:0;padding:0;overflow:hidden!important}
::-webkit-scrollbar{display:none}</style>
<style>${css}</style>`;

  const html = relink.html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, `<head>${head}</head>`);
  writeFileSync(join(dir, "index.html"), html);

  await context.close();

  /* Der Beweis, dass die Kopie niemanden von außen anfragt: im fertigen
     HTML darf keine http-Adresse mehr stehen. */
  const remote = [...new Set(html.match(/(?:src|href|poster|srcset)="https?:\/\/[^"]*"/g) || [])];
  return {
    files: map.size,
    bytes: html.length,
    remote,
    posterFallbacks: relink.posterFallbacks,
    orphans: relink.orphans,
  };
}

/**
 * Rechnet ein zu schweres Video klein: schmaler, kürzer, ohne Ton.
 * Gibt den neuen Inhalt zurück — oder null, wenn kein ffmpeg da ist oder
 * die Umrechnung scheitert. Dann bleibt es beim Standbild.
 */
function shrinkVideo(body, url) {
  if (!FFMPEG) return null;
  const stem = join(tmpdir(), "dm-hero-" + createHash("sha1").update(url).digest("hex").slice(0, 10));
  const src = stem + (extname(new URL(url).pathname) || ".mp4");
  const dst = stem + ".small.mp4";
  try {
    writeFileSync(src, body);
    const run = spawnSync(
      FFMPEG,
      [
        "-y", "-i", src,
        "-t", String(TRANSCODE_SECONDS),
        "-an",
        "-vf", `scale='min(${TRANSCODE_WIDTH},iw)':-2`,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "32",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        dst,
      ],
      { encoding: "utf8", timeout: 240_000 },
    );
    if (run.status !== 0 || !existsSync(dst) || statSync(dst).size === 0) return null;
    return readFileSync(dst);
  } catch {
    return null;
  } finally {
    for (const f of [src, dst]) {
      try { if (existsSync(f)) unlinkSync(f); } catch { /* egal */ }
    }
  }
}

function guessExt(type = "") {
  if (type.includes("png")) return ".png";
  if (type.includes("jpeg")) return ".jpg";
  if (type.includes("webp")) return ".webp";
  if (type.includes("avif")) return ".avif";
  if (type.includes("svg")) return ".svg";
  if (type.includes("mp4")) return ".mp4";
  if (type.includes("woff2")) return ".woff2";
  if (type.includes("woff")) return ".woff";
  if (type.includes("css")) return ".css";
  return ".bin";
}

/* ────────────── Lauf ────────────── */

const only = process.argv.slice(2);
const todo = only.length ? CASES.filter((c) => only.includes(c.slug)) : CASES;
if (!todo.length) {
  console.error(`build-case-heroes: kein Kunde passt auf ${only.join(", ")}`);
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: CHROME });
const summary = [];

try {
  for (const entry of todo) {
    let server = null;
    let base = entry.url;
    if (entry.dir) {
      if (!existsSync(join(entry.dir, "index.html"))) {
        console.error(`build-case-heroes: FEHLER — ${entry.slug}: ${entry.dir}/index.html fehlt.`);
        process.exit(1);
      }
      const served = await serveDir(entry.dir);
      server = served.server;
      base = served.base;
    }
    console.log(`build-case-heroes: ${entry.slug} ← ${entry.dir ? entry.dir : base}`);
    try {
      for (const [i, vp] of VIEWPORTS.entries()) {
        const res = await freezeOne(browser, entry, base, vp, i === 0);
        console.log(
          `    ${vp.name}: ${res.files} Dateien, ${(res.bytes / 1024).toFixed(0)} kB HTML, ` +
            `${res.posterFallbacks} Video(s) auf Standbild, ${res.orphans} tote Verweise entfernt`,
        );
        if (res.remote.length) {
          console.error(`build-case-heroes: FEHLER — ${entry.slug}/${vp.name} ruft noch fremde Adressen auf:`);
          for (const r of res.remote.slice(0, 6)) console.error(`      ${r.slice(0, 110)}`);
          process.exitCode = 1;
        }
        summary.push({ slug: entry.slug, viewport: vp.name, ...res });
      }
    } finally {
      if (server) server.close();
    }
  }
} finally {
  await browser.close();
}

writeFileSync(join(OUT, "build-report.json"), JSON.stringify(summary, null, 2));
console.log(`build-case-heroes: fertig — ${summary.length} Startbereiche.`);
