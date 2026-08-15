/// <reference types="vite/client" />

/**
 * Build date, injected by the `define` block in vite.config.ts as an ISO
 * 8601 date string (YYYY-MM-DD). Consumed by src/seo.tsx to emit an honest
 * `dateModified` in every page's JSON-LD — see gate item E1.16.
 */
declare const __BUILD_DATE__: string;
