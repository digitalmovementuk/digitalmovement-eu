#!/usr/bin/env node
/**
 * Veröffentlicht dist/ auf dem Zweig gh-pages — und prüft danach, ob die
 * Seite draußen wirklich vollständig ist.
 *
 * Warum nicht mehr das Paket `gh-pages`:
 *
 * Am 15.08.2026 meldete `gh-pages -d dist` „Published", und die Startseite
 * antwortete brav mit 200. Ausgeliefert wurde trotzdem nacktes HTML: der
 * Ordner assets/ mit sämtlichem JavaScript, CSS und allen Schriften fehlte
 * im Zweig, 25 Dateien liefen ins Leere. Ursache war eine Zeile `Assets/` in
 * der .gitignore des Projekts — auf macOS gilt core.ignorecase=true, also
 * schloss sie auch `assets/` aus. Das Werkzeug hat den Zweig ausgecheckt,
 * dessen .gitignore mitgelesen und den Ordner stillschweigend übersprungen.
 *
 * Dieses Skript kann das nicht: es baut den Zweig aus einem frischen,
 * leeren Git-Verzeichnis, in dem es keine .gitignore gibt, und zählt danach
 * nach. Zwei Prüfungen, beide brechen mit Code 1 ab:
 *
 *   1. Vor dem Push: jede Datei aus dist/ muss auch in `git ls-files`
 *      auftauchen. Gleiche Anzahl, sonst Abbruch.
 *   2. Nach dem Push: die veröffentlichte Startseite wird geholt, jede
 *      darin referenzierte lokale Datei einzeln angefragt. Eine einzige
 *      Antwort ungleich 200 lässt den Lauf scheitern.
 *
 * Die zweite Prüfung wartet, bis GitHub Pages den neuen Stand ausliefert —
 * bis zu fünf Minuten. Ein Zeitablauf ist ein Fehler, kein Erfolg.
 *
 * Aufruf: node scripts/publish.mjs [--skip-live-check]
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const REMOTE = "https://github.com/digitalmovementuk/digitalmovement-eu.git";
const BRANCH = "gh-pages";
/* Adresse der Live-Prüfung. Über DM_PUBLISH_LIVE umstellbar — nur damit die
   Prüfung selbst gegen eine absichtlich kaputte Kopie getestet werden kann.
   Für den echten Lauf nie setzen. */
const LIVE = process.env.DM_PUBLISH_LIVE || "https://digitalmovement.eu/";

/** Ordner, die Vite als Nebenprodukt anlegt und die nicht ausgeliefert werden. */
const SKIP = new Set([".vite", ".DS_Store"]);

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

function fail(message) {
  console.error(`publish: FEHLER — ${message}`);
  process.exit(1);
}

if (!existsSync(DIST)) fail("dist/ fehlt. Erst `npm run build` laufen lassen.");

const expected = listFiles(DIST).sort();
if (expected.length === 0) fail("dist/ ist leer.");
if (!expected.includes("index.html")) fail("dist/index.html fehlt.");
if (!expected.some((f) => f.startsWith("assets/"))) {
  fail("dist/assets/ ist leer — der Build hat kein JavaScript erzeugt.");
}

// ---------- Zweig bauen ----------
const work = mkdtempSync(join(tmpdir(), "dm-eu-publish-"));
try {
  run("rsync", ["-a", "--delete", "--exclude", ".vite", `${DIST}/`, `${work}/`]);
  run("git", ["init", "-q", "-b", BRANCH], work);
  run("git", ["add", "-A"], work);

  // -c core.quotepath=false: ohne das schreibt Git jeden Nicht-ASCII-Pfad in
  // Anfuehrungszeichen und mit Oktal-Escapes -- "mehr-sales-f\\303\\274r-..." --
  // und der Vergleich unten haelt jede Datei mit Umlaut im Namen fuer fehlend.
  // Umgekehrt gefaehrlicher: haette der Vergleich anders herum gestimmt, waere
  // eine wirklich fehlende Datei nicht aufgefallen.
  const tracked = run("git", ["-c", "core.quotepath=false", "ls-files"], work)
    .split("\n").filter(Boolean).sort();

  // Prüfung 1: nichts darf unterwegs verloren gehen.
  const missing = expected.filter((f) => !tracked.includes(f));
  if (missing.length) {
    fail(
      `${missing.length} von ${expected.length} Dateien wurden nicht aufgenommen. ` +
        `Erste fehlende: ${missing.slice(0, 5).join(", ")}`,
    );
  }
  console.log(`publish: ${tracked.length} Dateien aufgenommen, davon ` +
    `${tracked.filter((f) => f.startsWith("assets/")).length} in assets/`);

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  run(
    "git",
    [
      "-c", "user.name=Digital Movement",
      "-c", "user.email=alex@digitalmovement.uk",
      "commit", "-q", "-m", `Deploy ${stamp}`,
    ],
    work,
  );
  run("git", ["push", "-q", "--force", REMOTE, BRANCH], work);
  console.log(`publish: ${BRANCH} veröffentlicht.`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (process.argv.includes("--skip-live-check")) {
  console.log("publish: Live-Prüfung übersprungen (--skip-live-check).");
  process.exit(0);
}

// ---------- Prüfung 2: was draußen ankommt ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Alle lokalen Dateien, die die Startseite anfordert. */
function localRefs(html) {
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
    const url = m[1];
    if (url.endsWith("/") || url.includes("#")) continue;
    if (/\.(js|css|woff2?|svg|png|jpe?g|webp|mp4|ico|json|xml)$/i.test(url)) refs.add(url);
  }
  return [...refs];
}

/**
 * Nur der Status, nicht der Inhalt — und deshalb HEAD.
 *
 * Der erste Anlauf holte jede Datei mit GET und las den Körper nie aus. Bei
 * den Hero-Videos (mehrere MB) hängt Node dann: die Antwort gilt als
 * erledigt, sobald der Kopf da ist, der ungelesene Strom blockiert aber die
 * Verbindung, und der Lauf stand nach elf Minuten immer noch bei Datei drei.
 * HEAD überträgt nichts, was ausgelesen werden müsste.
 */
async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.status;
  } catch {
    return 0;
  }
}

const deadline = Date.now() + 5 * 60 * 1000;
let html = "";
let refs = [];

// Warten, bis der neue Stand ausgeliefert wird: die Startseite muss mindestens
// eine Datei aus assets/ nennen, die auch tatsächlich antwortet.
for (;;) {
  const res = await fetch(`${LIVE}?publish-check=${Date.now()}`, { cache: "no-store" });
  if (res.ok) {
    html = await res.text();
    refs = localRefs(html);
    const firstAsset = refs.find((r) => r.startsWith("/assets/"));
    if (firstAsset) {
      const probe = await head(new URL(firstAsset, LIVE));
      if (probe === 200) break;
    }
  }
  if (Date.now() > deadline) {
    fail("Fünf Minuten gewartet — die veröffentlichte Startseite liefert ihre Dateien nicht aus.");
  }
  await sleep(10_000);
}

/* Eine Prüfung, die nichts findet, hat nichts geprüft. Beim Aufbau dieses
   Tests lieferte der Server eine Verzeichnisliste statt der Startseite —
   null Verweise, null Fehler, und der Lauf meldete „bestanden". Der
   Startseite dieses Projekts liegen rund 45 Dateien bei; unter zehn stimmt
   etwas mit der Prüfung selbst nicht. */
if (refs.length < 10) {
  fail(`nur ${refs.length} Verweise in der Startseite gefunden — die Prüfung selbst ist kaputt.`);
}

const broken = [];
for (const ref of refs) {
  const status = await head(new URL(ref, LIVE));
  if (status !== 200) broken.push(`${status || "keine Antwort"} ${ref}`);
}

if (broken.length) {
  fail(
    `${broken.length} von ${refs.length} Dateien fehlen auf der Live-Seite:\n  ` +
      broken.join("\n  "),
  );
}

console.log(`publish: Live-Prüfung bestanden — ${refs.length} Dateien, alle 200.`);
