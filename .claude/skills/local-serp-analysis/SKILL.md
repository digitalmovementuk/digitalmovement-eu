---
name: local-serp-analysis
description: Measure what Google really shows in one city or district, and analyse the pages behind it. Picks the right tool for each part, based on a calibration test from 11/2026. Use whenever a task needs local Google rankings, a local SERP reading, a map pack / Kartenbereich / Local Pack check, competitors near a location, a SERP brief, a top-10 content analysis, "wer rankt in Essen", "Rankings aus Frintrop", "lokale SERP-Analyse", Stadtteil demand, competitor ratings and review counts, or Google autocomplete suggestions. Also use it before calling Serper, SerpApi, DataForSEO, Firecrawl search or Firecrawl scrape for anything SERP-related, and whenever seo-page-builder needs local SERP data or a SERP brief. Never measure local rankings with a SERP API alone.
---

# local-serp-analysis

Tool routing and procedure for local Google SERP measurement and SERP briefs.
Based on a calibration run in 11/2026. Evidence: `references/tool_routing_evidence.md`.

## Core rule

A local SERP reading counts only if it comes from a browser with its **device location set to the measuring point**, and the SERP footer shows that location. Without a device location Google falls back to the IP address, which can be a city 100+ km away. Every API tested returned at least some readings from the wrong city.

## Tool routing (use exactly this)

| Job | Tool | Status |
|---|---|---|
| Organic SERP, ads, map pack for a location | Browser with device location (own machine) | ✅ primary source |
| Cross-check in neighbouring cities | SerpApi, `location` + `google_domain=google.de` | ⚠️ counts only where it matched in calibration (Oberhausen, Bottrop). Never for Essen |
| Map pack / Kartenbereich at scale | DataForSEO (local pack items only) | ⚠️ map pack correct everywhere; organic items NOT usable |
| Competitor list with coordinates, stars, review counts per district | Serper `/maps` with `ll=@lat,lng,zoom` | ✅ |
| Competitor review texts | Serper `/reviews` | ✅ |
| Search suggestions (e.g. which Essen districts people search) | Serper `/autocomplete` | ✅ |
| Content of pages behind the SERP (top 10) | Firecrawl scrape | ✅ 1 credit/page, follows `google.com/goto` links itself |
| Organic results or ads from Serper `/search` | — | ❌ location ignored (Essen → Waldshut, Lörrach), no map pack, no ads |
| Firecrawl search for local results | — | ❌ location ignored (Essen → Rostock) |
| DataForSEO / SerpApi organic for Essen | — | ❌ returned a national list (Bochum, Moers, Köln) |
| Serper scrape for content analysis | — | ❌ 136 words vs 1,229 from Firecrawl on the same page |

If a job is not in this table, ask before picking a tool. Do not fall back to a ❌ tool because the right one is slow or unavailable. Report the gap instead.

## Where the browser runs

- Run Google readings on the user's own machine: local Claude Code with `scripts/serp_reading.mjs`, or Claude in Chrome with a DevTools location override.
- Cloud containers (claude.ai/code sessions) get Google's `/sorry` CAPTCHA on the first query (tested 2026-11-10). In a cloud session, do the API and Firecrawl parts only, and hand the browser part to the user's machine.
- Setup, verification and pacing: `references/browser_reading.md`.

## Procedure

1. **Scope.** Keywords (without the place name, plus with it where relevant), measuring points (district centroids from `references/measuring_points.md`), date. Count queries = keywords × points. Over 40 → show the count and ask.
2. **Browser readings.** Load `references/browser_reading.md`. Run slowly, in packages: one measuring point per package, max 10 queries, 45–90 s random wait between queries, ≥15 min between packages. On a CAPTCHA or `/sorry`: stop, save, tell the user. Never solve or bypass it.
3. **Verify every reading.** The footer location must name the measuring point (or its city) and come from the device, not the IP. Otherwise mark `verified=no` and do not use the reading.
4. **Cross-check (optional).** SerpApi for neighbouring cities where it passed calibration. If SerpApi and the browser disagree, the browser wins. Log the mismatch.
5. **Map pack depth.** Serper `/maps` per district for the full competitor list with coordinates, rating and review count. Serper `/reviews` for review texts of the top competitors. DataForSEO only when the map pack is needed for many points.
6. **Demand hints.** Serper `/autocomplete` for `{service} {city}` and `{service} {city}-` to find the districts and modifiers people type.
7. **Page analysis.** Firecrawl scrape on the top 10 organic URLs per keyword × point, as found in the browser reading (pass `google.com/goto` links as they are). Load `references/api_calls.md` for parameters.
8. **Output.** Reading log + SERP brief, format in `references/serp_brief.md`. The brief is short, in German for the team, WhatsApp style.

## Legacy readings

Treat every stored SERP reading without a recorded footer location and location source as **unverified**. This includes older browser readings made without a device location, some of which were measured from a city outside the target area. Do not use them in briefs, reports or client messages until they have been measured again.

## Re-calibration

The routing table is a snapshot. Run the calibration again (protocol in `references/tool_routing_evidence.md`) when:
- a quarter has passed since the last run (last: 11/2026),
- a provider announces location or SERP changes,
- a reading looks implausible (businesses from far away, no map pack).

After the run, update the table and the evidence file. Do not keep using a tool that failed the latest run.

## Cost and time

- Browser: no API cost, slow (~10 queries per 15 min package).
- Firecrawl: 1 credit per page, so ~10 credits per SERP brief (top 10). Stealth or enhanced proxy costs more, so ask first.
- Serper / SerpApi / DataForSEO: per call. Keep calls to the jobs in the table.

## Files

- `references/tool_routing_evidence.md`: calibration results 11/2026 and re-run protocol
- `references/browser_reading.md`: device location setup, footer check, pacing, reading log
- `references/api_calls.md`: Serper, SerpApi, DataForSEO, Firecrawl parameters
- `references/serp_brief.md`: SERP brief format and aggregation
- `references/measuring_points.md`: coordinates of the standard measuring points
- `scripts/serp_reading.mjs`: Playwright reader for the user's own machine

Load only what the current step needs.
