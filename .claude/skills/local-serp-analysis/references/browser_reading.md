# Browser reading with device location

The only verified source for local organic results, ads and the map pack.

## Requirements

- Runs on the user's own machine (home or office connection). Not in a cloud container: Google answers there with `/sorry` straight away.
- Device location = the measuring point (coordinates in `measuring_points.md`).
- Geolocation permission for google.de is granted.
- Language `de-DE`, time zone `Europe/Berlin`.
- After the page loads, the footer shows the measuring point, and the location comes from the device.

## Option A: local Claude Code + script (preferred)

```bash
# one package = one measuring point, max 10 queries
# <skill-dir> = folder of this skill, e.g. .claude/skills/local-serp-analysis
node <skill-dir>/scripts/serp_reading.mjs \
  --point frintrop --q "bestatter" --q "bestattung" --q "bestatter essen"
```

- Uses the installed Google Chrome (`channel: chrome`) with its own profile in `~/.serp-reading-profile`, so the consent choice is kept between runs. `--bundled` uses Playwright's Chromium instead.
- Sets the geolocation, grants the permission, rejects the consent banner, and clicks "Standort aktualisieren" once if Google offers it.
- Waits 45–90 s (random) between queries. Refuses more than 10 queries per run.
- Stops at `/sorry` or a CAPTCHA and saves what it has.
- Saves per query: screenshot, HTML, page text, footer text, and all result links (`*.json`). Also appends one summary line per query to `readings.jsonl`.
- Output folder: `serp-readings/{YYYY-MM-DD}/{point}/` in the current directory, or `--out <dir>`. Keep it out of git (screenshots of third-party SERPs; client repos are often public).

The script only collects. Claude then reads the page text and screenshot and writes the reading log (below). This keeps it working when Google changes its markup.

## Option B: Claude in Chrome (user's real Chrome)

1. The user opens a new tab, opens DevTools (F12), ⋮ → More tools → Sensors.
2. Location → "Other…" → latitude and longitude of the measuring point.
3. Keep DevTools open in that tab. The override only applies there, and only while DevTools is open.
4. Allow location access for google.de when asked (site settings → Location → Allow).
5. Open `https://www.google.de/search?q={keyword}&hl=de&gl=de`, scroll to the footer, click "Standort aktualisieren" if shown, then reload.
6. Claude reads the page text (and a screenshot if needed). Same pacing and verification rules as Option A.

The user's real Chrome is signed in to Google. Personal search history can shift results. Prefer Option A for client reports. If Option B is used, note `signed_in=yes` in the log.

## Footer verification (every reading)

Read the last lines of the page (the footer). Google states the location there plus where it came from.

- `verified=yes`: the footer names the measuring point or its city, and the source is the device (precise location / "Gerät").
- `verified=no`: the source is the IP address ("IP-Adresse"), or "bisherige Aktivitäten", or a different place, or no footer.

Write the footer text into the log word for word. Never use an unverified reading for a brief, report or client message.

## Pacing

- One measuring point per package. Max 10 queries per package.
- 45–90 s random wait between queries. At least 15 min between packages.
- Max ~6 packages per machine per day unless the user agrees to more.
- On `/sorry`, a CAPTCHA or "ungewöhnlicher Datenverkehr": stop the package, save, tell the user. Do not solve it, do not switch IPs, do not retry for several hours.

## Reading log

One line per result, as CSV or JSONL. Fields:

```
reading_id        {date}_{point}_{keyword-slug}
date, time        local time, Europe/Berlin
keyword           exactly as typed
point             key from measuring_points.md
lat, lng
tool              browser-script | chrome-devtools | serpapi | dataforseo | serper-maps
signed_in         yes | no
footer_text       verbatim
location_source   device | ip | activity | unknown
verified          yes | no
block             ad | map_pack | organic | paa | related | autocomplete
position          1-based within the block
name_or_title     business name (map pack) or result title
displayed_url     as shown in the SERP
link              href as found, including google.com/goto links
final_url         after Firecrawl scrape (metadata url), else empty
domain            registrable domain of final_url
rating, reviews   map pack only
notes
```

Record per SERP: all ads (top and bottom), the full map pack (usually 3), organic positions 1–10, and the People-also-ask questions.
