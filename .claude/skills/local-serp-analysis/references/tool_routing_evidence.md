# Tool routing evidence

## Calibration run 11/2026

Test term: `bestatter` (no place name in the query).
Measuring points: Essen-Frintrop, Essen-Mitte, Oberhausen, Mülheim an der Ruhr, Bottrop, Gelsenkirchen.
Pass criterion: the results come from the measuring city or its direct surroundings, with real local businesses and domains.

### SERP sources

| Tool | Result | Verdict |
|---|---|---|
| Serper `/search` | Location ignored. "Essen" returned Waldshut and Lörrach, "Köln" returned Heilbronn. No map pack, no ads. | ❌ never for local SERPs |
| Firecrawl search | Location ignored. "Essen" returned Rostock twice, "München" returned Mainz. | ❌ never for local SERPs |
| DataForSEO | Map pack correct and stable at all points. Organic results mostly a national list (Bochum, Moers, Köln), also with google.de. | ⚠️ map pack only |
| SerpApi | Oberhausen and Bottrop correct. Essen wrong (same national list). | ⚠️ cross-check only where it passed |
| Browser, device location set | Every city shows its own businesses, stable, with real domains. | ✅ primary source |

Side finding: without a device location, Google locates by IP. During the test that IP location was a city far outside the Ruhr area. Earlier browser readings made without a device location are therefore partly not from Essen at all. See "Legacy readings" in SKILL.md.

Cloud check (2026-11-10): a Playwright browser in a claude.ai/code cloud container got Google's `/sorry` page ("ungewöhnlicher Datenverkehr") on the first query, even with the device location set. Browser readings must run on the user's own machine.

### Page analysis

| Tool | Result | Verdict |
|---|---|---|
| Firecrawl scrape | Opens Google's new redirect links (`google.com/goto`) itself, without our IP. 1 credit per page. Returns text, headings, title and schema. Examples: bestatter-in-essen.de 1,229 words, 3 × H2. Bergermann (Gelsenkirchen) 5,376 words with Organization schema. Gelbe Seiten with FAQPage schema. | ✅ |
| Serper scrape | Only 136 words from the same page (bestatter-in-essen.de). | ❌ too little for analysis |

Re-check 2026-11-11 (Firecrawl, homepage `https://www.bestatter-in-essen.de/`): 225 words main content (`onlyMainContent: true`), under 450 for the full page, 1 × H1, 3 × H2, 1 credit per call, served from Firecrawl's cache. The H2 count matches the test. The 1,229 words do not, so they were probably counted on a different URL (a subpage from the SERP) or in a different way. Since then every word count is quoted with its URL and method (`words` = main content, `words_full_page` = whole page), via `scripts/page_metrics.mjs`. Re-count older numbers before comparing them.

### What Serper is still good for

- `/maps`: competitors with coordinates, stars and review count per district
- `/reviews`: review texts of competitors
- `/autocomplete`: search suggestions, e.g. which Essen districts people search

## Re-run protocol

1. Pick a test term without a place name that has strong local intent for the current client (default `bestatter`, or the client's main service).
2. Use the six standard measuring points from `measuring_points.md`, or the client's own area.
3. For each point, read the SERP with:
   - browser with device location (reference reading, footer must be verified)
   - SerpApi with `location` = canonical location of the point
   - DataForSEO with `location_coordinate`
   - Serper `/search` with `location` and `gl=de`
   - Firecrawl search with `location`
4. Compare each tool against the browser reading, separately for organic, map pack and ads:
   - pass: same city, mostly the same businesses or domains
   - partial: same region, different order or some foreign results
   - fail: a different city or a national list
5. Scrape one top-10 URL with Firecrawl and with Serper scrape. Compare word count, headings and schema.
6. Write the matrix into this file with the date. Update the routing table in SKILL.md.
7. Keep the old run below the new one, so changes over time stay visible.
