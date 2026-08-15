#!/usr/bin/env node
/**
 * Post-build: sitemap.xml, plus assertions that the build is actually
 * crawlable.
 *
 * The sitemap is derived from the HTML files the build emitted, not from a
 * hand-kept list. That is deliberate: the sitemap previously registered for
 * digitalmovement.uk drifted out of sync and ended up 404ing, which left
 * Google with zero discovered pages. A list generated from build output
 * cannot drift — if a route stops being built, it leaves the sitemap in the
 * same commit.
 *
 * vite-react-ssg writes flat files (dist/about.html, dist/services/seo.html)
 * and produces dist/404.html directly. GitHub Pages resolves /about to
 * about.html and returns 200, and serves 404.html with a real 404 status for
 * anything it has no file for — which is what makes unmatched paths behave
 * correctly instead of the old `cp dist/index.html dist/404.html` trick that
 * returned 404 for every real page.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://digitalmovement.eu";
const SKIP_DIRS = new Set(["assets", "brand", "video"]);

async function findHtml(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await findHtml(full, found);
    } else if (entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

/** dist/services/seo.html -> /services/seo ; dist/index.html -> / */
function toRoutePath(absFile) {
  const rel = relative(DIST, absFile).split("\\").join("/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/\.html$/, "")}`;
}

function fail(message) {
  console.error(`postbuild: ${message}`);
  process.exit(1);
}

async function main() {
  if (!existsSync(DIST)) fail("dist/ not found — run the build first.");

  // ---- 1. The GitHub Pages not-found page must exist and must NOT be a
  //         copy of the homepage. That copy is the original defect.
  const notFound = join(DIST, "404.html");
  if (!existsSync(notFound)) {
    fail("dist/404.html was not generated — the 404 route is missing from src/routes.tsx.");
  }
  const notFoundHtml = await readFile(notFound, "utf8");
  const homeHtml = await readFile(join(DIST, "index.html"), "utf8");
  if (notFoundHtml === homeHtml) {
    fail("dist/404.html is a byte-identical copy of the homepage — the SPA fallback is back.");
  }
  if (!/noindex/i.test(notFoundHtml)) {
    fail("dist/404.html is missing its noindex directive.");
  }

  // ---- 2. Emit a directory twin for every flat page ---------------------
  // GitHub Pages resolves /about to about.html, and /about/ to
  // about/index.html. Shipping both means the route answers 200 either way,
  // with no redirect and no dependence on which resolution rule the host
  // applies. Both copies carry the same canonical (/about), so the duplicate
  // is declared rather than competing.
  for (const file of await findHtml(DIST)) {
    const path = toRoutePath(file);
    if (path === "/" || path === "/404") continue;
    const dir = join(DIST, path.slice(1));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), await readFile(file, "utf8"), "utf8");
  }

  // ---- 3. Sitemap from what was actually built --------------------------
  // Only the flat files are listed; the directory twins are the same URL.
  const files = (await findHtml(DIST)).filter((f) => !f.endsWith(`${sep}index.html`) || f === join(DIST, "index.html"));

  // A page that tells crawlers not to index it must not then be advertised in
  // the sitemap — the two directives contradict each other and Search Console
  // reports it as an error. Detected by reading the built HTML rather than by
  // keeping a list of excluded paths, so retired URLs drop out on their own.
  // The internal preview build marks every page noindex on purpose, so the
  // filter below would strip the lot and trip the "no HTML pages" guard. There
  // the sitemap is an inventory for the overview widget, not a crawl
  // instruction, so it lists everything. The public build keeps the real rule.
  const internal = process.env.VITE_INTERNAL_OVERVIEW === "1";

  const indexable = [];
  for (const f of files) {
    const html = await readFile(f, "utf8");
    if (!internal && /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
    indexable.push(f);
  }

  const routePaths = indexable
    .map(toRoutePath)
    .filter((p) => p !== "/404")
    .sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));

  if (routePaths.length === 0) fail("no HTML pages found in dist/.");

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routePaths
    .map((p) => {
      const loc = p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");

  await writeFile(
    join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8",
  );

  // ---- 4. Every page must carry its own title, or pre-rendering has not
  //         actually solved the duplicate-metadata problem.
  const titles = new Map();
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const path = toRoutePath(file);
    if (!title) fail(`${path} has no <title> in its pre-rendered HTML.`);
    if (titles.has(title)) {
      fail(`${path} and ${titles.get(title)} share the title "${title}".`);
    }
    titles.set(title, path);
    if (!/<link[^>]+rel="canonical"/i.test(html)) {
      fail(`${path} has no canonical link in its pre-rendered HTML.`);
    }
  }

  // ---- 5. robots.txt must point at a sitemap this build produces --------
  const robotsPath = join(DIST, "robots.txt");
  if (existsSync(robotsPath)) {
    const declared = (await readFile(robotsPath, "utf8")).match(/^\s*Sitemap:\s*(\S+)/im)?.[1];
    if (declared && !declared.endsWith("/sitemap.xml")) {
      fail(`robots.txt points at ${declared}, which this build does not produce.`);
    }
  } else {
    console.warn("postbuild: no robots.txt in dist/ — expected one from public/.");
  }

  // ---- 6. The build must actually carry a lead destination --------------
  // Vite inlines VITE_* at build time, so a build run without them succeeds
  // and ships a site whose forms deliver nowhere — the exact defect that made
  // every past enquiry disappear, and one that is invisible from the outside
  // because the page looks perfectly normal. Check the emitted JS rather than
  // process.env: what matters is what reached the bundle.
  const assetsDir = join(DIST, "assets");
  if (existsSync(assetsDir)) {
    const js = (await readdir(assetsDir)).filter((f) => f.endsWith(".js"));
    let bundle = "";
    for (const f of js) bundle += await readFile(join(assetsDir, f), "utf8");

    // Digital Movement's own PHP handler is the primary destination and needs
    // no key, so its presence alone satisfies the check. Web3Forms remains
    // supported, but only counts when a real key shipped with it — a bare
    // endpoint with no key delivers nothing.
    const hasDmEndpoint = /leads\.digitalmovement\.uk/.test(bundle);
    const hasWeb3FormsKey = /"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"/.test(bundle);
    const hasWeb3Forms = /api\.web3forms\.com/.test(bundle) && hasWeb3FormsKey;
    const hasDestination = hasDmEndpoint || hasWeb3Forms;

    // Consent is not optional: the handler rejects a payload without it, and a
    // lead collected without recorded consent must not be transmitted at all.
    // If the string vanishes from the bundle the forms are silently broken.
    if (!/consent/.test(bundle)) {
      fail("the bundle carries no consent field — the lead endpoint will reject every enquiry.");
    }

    if (!hasDestination) {
      if (process.env.ALLOW_NO_LEAD_ENDPOINT === "1") {
        console.warn(
          "postbuild: WARNING — no lead destination in the bundle. The forms will show a visible failure and the direct email. Building anyway because ALLOW_NO_LEAD_ENDPOINT=1.",
        );
      } else {
        fail(
          "no lead destination reached the bundle — VITE_DM_LEAD_ENDPOINT should default to https://leads.digitalmovement.uk/ (see src/lib/submitLead.ts), or set ALLOW_NO_LEAD_ENDPOINT=1 to build without one deliberately.",
        );
      }
    } else {
      console.log("postbuild: lead destination present in the bundle");
    }

    if (/G-[A-Z0-9]{6,}/.test(bundle)) {
      console.log("postbuild: GA4 measurement ID present in the bundle");
    } else {
      console.warn("postbuild: WARNING — no GA4 measurement ID in the bundle (VITE_GA4_ID unset).");
    }
  }

  /* Jede Fallstudie braucht ihre eingefrorene Kopie.
   *
   * Seit dem 15.08.2026 zeigt jede Kachel den ersten Bildschirm der
   * Kundenseite aus dist/cases/<slug>/. Es gibt keinen zweiten Weg mehr —
   * fehlt der Ordner, bleibt die Kachel leer und niemand merkt es, weil
   * ein leerer iframe keinen Fehler wirft. Also hier, beim Bauen. */
  {
    const content = await readFile(join(ROOT, "src", "content.ts"), "utf8");
    const block = content.slice(content.indexOf("export const caseStudies"));
    const slugs = [...block.matchAll(/^\s*slug: "([^"]+)",/gm)].map((m) => m[1]);
    if (slugs.length < 3) {
      fail(`only ${slugs.length} case slugs found in src/content.ts — this check is broken.`);
    }
    const missing = [];
    for (const slug of slugs) {
      for (const variant of ["desktop", "phone"]) {
        if (!existsSync(join(DIST, "cases", slug, variant, "index.html"))) {
          missing.push(`${slug}/${variant}`);
        }
      }
    }
    if (missing.length) {
      fail(
        `missing frozen hero copies: ${missing.join(", ")} — run "node scripts/build-case-heroes.mjs" ` +
          `after adding the client to CASES in that script, otherwise the tile renders empty.`,
      );
    }
    console.log(`postbuild: ${slugs.length} case studies, each with a frozen hero copy (desktop + phone)`);
  }

  console.log(`postbuild: ${routePaths.length} pages, each with a unique title and canonical`);
  for (const p of routePaths) console.log(`  ${p}`);
  console.log("postbuild: dist/404.html present, noindex, and distinct from the homepage");
  console.log("postbuild: wrote dist/sitemap.xml");
}

main().catch((err) => {
  console.error("postbuild failed:", err);
  process.exit(1);
});
