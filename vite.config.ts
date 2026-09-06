import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

// Digital Movement NZ — served from the root of www.digitalmovement.co.nz
// via GitHub Pages + CNAME, so the base is just "/". Local dev runs on
// 5185 to avoid clashing with the UK build on 5181 and the NEO ports.

/**
 * Inline the built CSS into the HTML so it isn't a render-blocking external
 * request. The whole stylesheet gzips to ~8 KB which is well under the
 * 14 KB sweet-spot, and removing the round-trip is worth ~250 ms of FCP on
 * the simulated 4G profile.
 */
function inlineCss(): Plugin {
  return {
    name: "inline-css",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const cssChunks = Object.values(ctx.bundle).filter(
          (c) => c.type === "asset" && /\.css$/.test(c.fileName),
        ) as Array<{ source: string | Uint8Array; fileName: string }>;
        if (cssChunks.length === 0) return html;
        const inlined = cssChunks
          .map((c) =>
            typeof c.source === "string" ? c.source : new TextDecoder().decode(c.source),
          )
          .join("\n");
        const styleTag = `<style data-inlined>${inlined}</style>`;
        // Remove the external CSS <link> Vite injected, and drop the inline
        // <style> in just before </head>.
        return html
          .replace(
            /<link\s+rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"[^>]*>\s*/g,
            "",
          )
          .replace("</head>", `${styleTag}\n  </head>`);
      },
    },
  };
}

/**
 * Internal preview build.
 *
 * `VITE_INTERNAL_OVERVIEW=1` produces a copy of the site carrying the LIVE
 * page-overview pill — an internal planning artefact that must never appear on
 * digitalmovement.co.nz. Three things are enforced here rather than left to the
 * deploy script, because forgetting any one of them publishes internal
 * projections on the client-facing domain:
 *
 *   1. The widget <script> is injected ONLY in this mode. The public build has
 *      no reference to it at all.
 *   2. `CNAME` is dropped from the output, so the internal deploy cannot bind
 *      the custom domain even if pushed to the wrong branch.
 *   3. `noindex,nofollow` is forced, so the preview can never be indexed as
 *      duplicate content against the real site.
 *
 * The internal build also needs its own base path, since it is served from a
 * project Pages URL (/digitalmovement-nz-internal/) rather than a domain root.
 */
const INTERNAL = process.env.VITE_INTERNAL_OVERVIEW === "1";
const BASE = process.env.VITE_BASE || "/";

function internalOverview(): Plugin {
  return {
    name: "internal-overview",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!INTERNAL) return html;
        return html
          .replace(
            "</head>",
            `  <meta name="robots" content="noindex,nofollow" />\n` +
              `  <script defer src="${BASE}overview-widget.js"></script>\n</head>`,
          );
      },
    },
    closeBundle() {
      if (!INTERNAL) return;
      // Never let the internal build claim the live domain. This runs against
      // the emitted directory rather than the bundle because CNAME arrives via
      // publicDir copying, which never passes through generateBundle.
      const cname = resolve(process.cwd(), "dist/CNAME");
      if (existsSync(cname)) {
        rmSync(cname);
        this.warn("internal build: removed dist/CNAME so it cannot bind the live domain");
      }
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), inlineCss(), internalOverview()],
  base: BASE,
  define: {
    /**
     * Build date, baked in at compile time and emitted as `dateModified` in
     * each page's schema.
     *
     * QA gate item E1.16 asks for freshness to be signalled *honestly*. The
     * build date is the one date we can state without lying: it is genuinely
     * when this version of the page was produced. A hand-set "last updated"
     * string is what that item exists to catch, because it drifts the moment
     * someone forgets to change it.
     */
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  server: {
    port: 5185,
    host: true,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunking is a client-bundle optimisation only. The SSR pass
        // that vite-react-ssg runs to pre-render each route treats react and
        // friends as externals, and Rollup refuses to put an external module
        // into a manual chunk — so applying this to both builds fails the
        // build outright with EXTERNAL_MODULES_CANNOT_BE_INCLUDED_IN_MANUAL_CHUNKS.
        manualChunks: isSsrBuild
          ? undefined
          : {
              "react-core": ["react", "react-dom", "react-router-dom"],
              motion: ["framer-motion"],
              lenis: ["lenis"],
              icons: ["lucide-react"],
            },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));

// Silence unused-import warning when the helpers aren't pulled in (kept for
// future tweaks to the plugin).
void readFileSync;
void resolve;
