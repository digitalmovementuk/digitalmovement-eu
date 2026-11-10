# Semrush Browser Agent Playbook

Used in STEP 2a of the skill. Requires Claude in Chrome tool access.

Scope: Semrush gives volume, KD, intent and CPC. It is not a source for local rankings or SERP snapshots. Those come from verified browser readings (STEP 2b, local-serp-analysis skill).

## Preconditions

- User has active Semrush subscription
- User is logged in to Semrush in Chrome
- User confirmed browser agent access at STEP 1

If any fail → use the demand-signal fallback from SKILL.md STEP 2a (Serper `/autocomplete`, People-also-ask from verified readings). Weaker, directional only. Warn the user. No web_search, Serper `/search` or Firecrawl search as a substitute.

## Execution

### 1. Build query list before opening browser

From STEP 1 intake:
- Services (N items)
- Locations (M items)
- Modifiers (K items, from defaults or user override)

Build combinations:
```
bases: N service-only queries
modifier_masters: N × K queries
geos: N × M queries
modifier_geos: N × K × M queries (largest set)
```

Total = N + NK + NM + NKM

For NEO default (3 services, 20 locations, 4 modifiers):
= 3 + 12 + 60 + 240 = **315 queries**

If total > 200 → show count, ask user to cap. Suggest dropping modifier+geo combos to reduce to ~75.

### 2. Navigate and query

Open Semrush Keyword Magic Tool (not Overview — Magic Tool handles batch better):
`https://www.semrush.com/analytics/keywordmagic/`

Set market/region based on language:
- DE → Germany (de)
- EN → target market from user input (UK, US, AU, DE-EN)

### 3. Query execution pattern

Per query:
1. Enter keyword in search field
2. Wait for results load (watch for volume column populated)
3. Extract top row:
   - Keyword (as typed, for exact match)
   - Volume (monthly)
   - KD% (keyword difficulty)
   - Intent (I/N/C/T — Informational/Navigational/Commercial/Transactional)
   - CPC (optional, useful for paid ads planning)
4. Log to in-memory CSV
5. If "no results" → log volume = 0, continue

### 4. Extraction selectors (subject to Semrush DOM changes)

Volume column: `td[data-at="search-volume"]` or equivalent
KD column: `td[data-at="kd"]`
Intent: `td[data-at="intent"] span`

If selectors fail → fall back to screenshot + OCR via `get_page_text`. Slower but robust.

### 5. Rate limiting

Semrush throttles at ~100 queries/hour on Pro plan, ~300/hour on Guru.
Pace: 1 query every 5 seconds.
If 429 or throttle warning → pause 60s, resume.

### 6. CAPTCHA / 2FA

Never bypass. If hit:
- Take screenshot
- Save progress
- Return to user: "Semrush requires verification, please complete and say 'resume'"

## Output

In-memory CSV becomes two files:

**`semrush_research_{vertical}_{YYYYMMDD}.csv`** — raw research
Columns: `query, service, modifier, location, volume, kd, intent, cpc, timestamp`

**Research brief** (STEP 3) — WhatsApp-style summary built from aggregations of the CSV.

## Aggregation logic for the brief

```
total_volume = sum(volume) where volume > 0
viable_keywords = count where volume >= 10 AND kd <= 70
dead_combinations = count where volume < 10

service_ranking = group by service, sum volume, count viable
location_ranking = group by location, sum volume, count viable

top_drivers = top 10 by volume where viable
```

Present in prose, not tables (user's WhatsApp format preference).

## Recommendation logic

Based on research, propose a filtered matrix:
- Keep all combinations with volume >= 20 OR KD <= 40
- Keep all Tier 1 city × service combos regardless of volume (brand signal)
- Drop all combinations with volume < 10 AND not Tier 1
- Flag combos with KD > 75 as "long-term play, don't prioritize"

This becomes the sitemap if user picks Artifact A.

## Cost note for user

Semrush API costs: 0. Uses user's existing subscription via browser session.
Time cost: ~5s per query + overhead = 20–30 min for 200 queries.
Claude token cost: extraction is lightweight, roughly 50 tokens per query output + 2k for the brief. Budget ~12k tokens for a 200-query run.
