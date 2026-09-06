#!/usr/bin/env node
/**
 * Entwurf veröffentlichen: new.digitalmovement.eu
 *
 * Seit dem 04.09.2026 geht kein Neuaufbau mehr direkt auf digitalmovement.eu.
 * Raoul prüft ihn zuerst unter new.digitalmovement.eu — ein eigenes Repo
 * (digitalmovementuk/digitalmovement-eu-new, Zweig gh-pages), ein eigener
 * CNAME-Eintrag bei Hostinger (new → digitalmovementuk.github.io).
 *
 * Das Skript nimmt den fertigen Ordner dist/ (also erst `npm run build`
 * und `node scripts/check-render.mjs`), kopiert ihn nach dist-draft/,
 * tauscht CNAME auf die Entwurfsadresse, setzt noindex in jede Seite und
 * schiebt das Ergebnis über publish.mjs. Die Live-Prüfung läuft gegen die
 * Entwurfsadresse.
 *
 * Aufruf: node scripts/publish-draft.mjs [--skip-live-check]
 */
import { execFileSync } from "node:child_process";
import { cpSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "dist");
const OUT = join(ROOT, "dist-draft");
const HOST = "new.digitalmovement.eu";
const REMOTE = "https://github.com/digitalmovementuk/digitalmovement-eu-new.git";

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
writeFileSync(join(OUT, "CNAME"), HOST + "\n");
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) { if (e !== "cases") walk(f); continue; }
    if (!f.endsWith(".html")) continue;
    let html = readFileSync(f, "utf8");
    if (!html.includes('name="robots"')) {
      html = html.replace("</head>", '<meta name="robots" content="noindex,nofollow"></head>');
    }
    writeFileSync(f, html);
  }
}
walk(OUT);
console.log(`publish-draft: dist-draft/ vorbereitet (CNAME ${HOST}, noindex, robots.txt Disallow)`);

execFileSync(process.execPath, [join(ROOT, "scripts/publish.mjs"), ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, DM_PUBLISH_DIST: OUT, DM_PUBLISH_REMOTE: REMOTE, DM_PUBLISH_LIVE: `https://${HOST}/` },
});
