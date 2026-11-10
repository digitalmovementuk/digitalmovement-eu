# API calls

Only for the jobs the routing table in SKILL.md allows. Parameter names were checked 11/2026. If a call errors, check the provider docs before changing the tool.

## Credentials

- Cloud session (claude.ai/code): ask with `request_credential` for the host (`google.serper.dev`, `serpapi.com`, `api.dataforseo.com`). The proxy adds the key. Never ask for keys in chat.
- Local: environment variables `SERPER_API_KEY`, `SERPAPI_API_KEY`, `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`.
- Firecrawl: use the Firecrawl connector (`firecrawl_scrape`) when it is connected, else the REST API with `FIRECRAWL_API_KEY`.

## Serper: maps, reviews, autocomplete only

Base `https://google.serper.dev`, `POST`, headers `X-API-KEY`, `Content-Type: application/json`.

Competitors per district (`/maps`):
```json
{ "q": "bestatter", "ll": "@51.4776,6.9083,14z", "gl": "de", "hl": "de" }
```
Keep from `places[]`: `position, title, address, latitude, longitude, rating, ratingCount, type, website, phoneNumber, cid, placeId`. Use `page: 2` for more.

Review texts (`/reviews`):
```json
{ "cid": "<cid from /maps>", "gl": "de", "hl": "de", "sortBy": "newest" }
```
Also accepts `fid` or `placeId`. Page with `nextPageToken`.

Suggestions (`/autocomplete`):
```json
{ "q": "bestatter essen ", "gl": "de", "hl": "de" }
```
Run the base term, `{term} {city} ` (trailing space) and `{term} {city}-` to surface districts. Keep `suggestions[].value`.

Never use `/search` or `scrape.serper.dev` for rankings or content analysis (see evidence).

## SerpApi: cross-check only

```
GET https://serpapi.com/search.json
  ?engine=google
  &q=bestatter
  &location=Oberhausen,North Rhine-Westphalia,Germany
  &google_domain=google.de&gl=de&hl=de
  &no_cache=true
  &api_key=...
```
Compare `local_results` (map pack), `ads` and `organic_results[].link` with the browser reading of the same day. Count it only for points that passed calibration (`measuring_points.md`). Never for Essen.

## DataForSEO: map pack only

- Map pack inside the SERP: `POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced`, keep only items with `type: "local_pack"`. Ignore all `organic` items.
- Full map list: `POST https://api.dataforseo.com/v3/serp/google/maps/live/advanced`.
- Body (array): `keyword`, `language_code: "de"`, `location_coordinate` built from the measuring point (check the endpoint docs for the zoom/radius suffix), `device: "desktop"`.
- Basic auth with login and password.

## Firecrawl scrape: pages behind the SERP

Connector call:
```json
{ "url": "<link from the reading, google.com/goto is fine>",
  "formats": ["markdown", "rawHtml"],
  "onlyMainContent": true,
  "objective": "Analyse a top-10 competitor page for a SERP brief" }
```
REST: `POST https://api.firecrawl.dev/v2/scrape` with the same body (without `objective`), header `Authorization: Bearer $FIRECRAWL_API_KEY`.

For a top-10 batch use REST and write straight to files, so ten raw pages do not flood the context:
```bash
i=0; while read -r url; do i=$((i+1))
  curl -sS https://api.firecrawl.dev/v2/scrape \
    -H "Authorization: Bearer $FIRECRAWL_API_KEY" -H "Content-Type: application/json" \
    -d "{\"url\":\"$url\",\"formats\":[\"markdown\",\"rawHtml\"],\"onlyMainContent\":true}" \
    > "fc_$(printf %02d $i).json"
done < top10_urls.txt
node scripts/page_metrics.mjs --csv fc_*.json > metrics.csv
```
Use the connector for a single page, or when no REST key is available. Then ask for `markdown` only and get schema types from a REST call later if needed.

- Expect 1 credit per page. Check the credit use on the first call of a run. If it is higher, drop `rawHtml` and tell the user.
- No `proxy: "stealth"` / `"enhanced"` without asking, because they cost more.
- `metadata.url` / `metadata.sourceURL` give the final URL after the redirect. Write it into `final_url` in the reading log.
- Firecrawl may serve a cached copy (`metadata.cacheState: "hit"`). Fine for briefs. Pass `maxAge: 0` only when a fresh copy matters, e.g. right after a competitor relaunch.
- Metrics: save the response as JSON and run `node scripts/page_metrics.mjs <file.json>`. It returns `words` (main content), `words_full_page` (from rawHtml), H1/H2/H3 counts, title, meta description and schema types in one consistent way. Do not count by eye.
- Quote word counts with URL and method. Main content and full page differ a lot (bestatter-in-essen.de: 225 vs. ~400), and numbers from different methods are not comparable.
- Do not use Firecrawl **search** to find local results.
