---
name: seo-page-builder
description: Build large-scale SEO landing page systems end-to-end (keyword research, local SERP reading, SERP briefs, sitemap, master templates, wireframes, copy). Version 2026-11. Use whenever the user wants to plan or produce a multi-page SEO build, run keyword research via Semrush, generate a search sitemap, create a master SEO/AI-Search landing page template, or produce HTML wireframes with or without populated copy. Trigger on phrases like "SEO build", "landing page sitemap", "400 pages", "service × location matrix", "master template", "wireframe", "landing page copy", "Rhein-Ruhr SEO", "NEO landing pages", "BuildMarque-style", "GEO/AEO pages", "AI search optimization", "keyword research via Semrush", "SERP-Brief", "lokale SERP-Analyse", "Top 10 analysieren", or any bulk SEO content job where services and locations get multiplied into pages. Local rankings and SERP briefs always go through the local-serp-analysis skill, never through Serper or Firecrawl search.
---

# seo-page-builder

Agentic SEO page system builder. Runs research + sitemap + templates + copy.

Version 2026-11. If an older skill with the same name is also listed (e.g. `anthropic-skills:seo-page-builder`), follow this one.

Tool names differ per surface. claude.ai: `ask_user_input_v0`, `/mnt/user-data/outputs/`, `present_files`. Claude Code: `AskUserQuestion`, the working directory (or the scratchpad in cloud sessions), `SendUserFile`.

## The flow (sequential, run top to bottom)

```
STEP 1 → Intake (one consolidated question block)
STEP 2 → Research: Semrush volumes (2a) + local SERP reading (2b)
STEP 3 → Research brief back to user
STEP 4 → Artifact selection with token estimates
STEP 5 → Produce selected artifact
STEP 6 → Stop. Ask if more.
```

No steps skipped. No steps merged. No steps reordered.

---

## STEP 1 — Intake

On trigger, ask ALL of the following in ONE message. Use `ask_user_input_v0` where it fits; free text for lists.

- **Language** — DE or EN
- **Vertical** — NEO THE AGENCY / Medical / Legal / Consulting / Other
- **Services** — comma-separated list (e.g. "Paid Ads, Website Development, Search Engine Optimization")
- **Locations** — comma-separated list OR "Rhein-Ruhr default" OR "none / national only"
- **Brand name** — if not NEO (skip if vertical = NEO)
- **USPs / founder credentials** — one paragraph, used in authority block
- **Semrush access** — confirm browser agent has Semrush session available (yes/no)
- **Measuring points** — where local SERPs are read. Default: the client's own district (e.g. Essen-Frintrop) plus the Tier 1 cities in the matrix. Coordinates: local-serp-analysis `references/measuring_points.md`
- **SERP briefs** — yes/no. One brief per target page costs ~10 Firecrawl credits (top 10 pages) plus browser time

If any answer missing → ask for that one specifically, do not proceed.

Cache all answers for the session. Never re-ask.

---

## STEP 2 — Research

### Tool routing (fixed, from the 11/2026 calibration)

- Search volume, KD, intent, CPC → Semrush (2a)
- Local rankings, ads, map pack → browser with device location (2b, local-serp-analysis)
- Competitors with stars and review counts, review texts, autocomplete → Serper `/maps`, `/reviews`, `/autocomplete`
- Content of ranking pages → Firecrawl scrape
- Never: Serper `/search` or Firecrawl search for rankings (location ignored), DataForSEO/SerpApi organic for Essen (national list), Serper scrape for content (too little text)

Details and evidence: local-serp-analysis skill.

### 2a — Semrush volumes via browser agent

**Tool**: Claude in Chrome browser agent. User's machine, user's Semrush session.

Before launching: tell user "Opening Semrush in browser. Will take 3–8 min depending on matrix size."

### What the agent does

For each `{service}` × `{modifier}` × `{location}` combination:

1. Navigate to Semrush Keyword Overview
2. Query the exact German or English phrase
3. Extract: monthly volume, keyword difficulty (KD), intent, CPC
4. Log to a running CSV in memory

Modifier set (default, German): `agentur`, `beratung`, `experten`, `freelancer`, `preise`
Modifier set (default, English): `agency`, `consultant`, `experts`, `services`, `pricing`

User can override modifier list at STEP 1.

### Query patterns

- Base: `{service}`
- Modifier: `{modifier} {service}` or `{service} {modifier}` (test both, keep higher volume)
- Geo: `{service} {location}`
- Modifier + geo: `{service} {modifier} {location}`

### Batch size cap

Never exceed 200 Semrush queries per run without user approval. Count combinations before launching. If >200, show estimate and ask.

### Failure handling

If Semrush blocks the session, rate-limits, or requires 2FA mid-run:
- Save partial results
- Tell user what's missing
- Ask: retry / skip missing / manual CSV upload

### Fallback

If user says "no Semrush access" at STEP 1:
- Offer the demand-signal fallback: Serper `/autocomplete` for suggestions, People-also-ask from verified browser readings (2b), Google Ads Keyword Planner if the user has access
- Do not use web_search, Serper `/search` or Firecrawl search results as demand or ranking data
- Warn: directional only, not authoritative volume
- Proceed only on user confirmation

### 2b — Local SERP reading

Run when the matrix has locations, or when SERP briefs are wanted.

1. Load the local-serp-analysis skill and follow its procedure.
2. Read the top keywords per Tier 1 location from the measuring points. Browser with device location, on the user's own machine, slowly and in packages. Cloud sessions cannot do this step (Google blocks them), so hand it to the user's machine.
3. Use only readings with `verified=yes` (footer shows the measuring point, source = device).
4. SerpApi as a cross-check for neighbouring cities, only where it passed calibration.
5. Serper `/maps` per district for the competitor field, `/autocomplete` for district demand.
6. Mark older readings without a footer check as unverified. Do not reuse them.

---

## STEP 3 — Research brief

After STEP 2, output a short brief in chat. No CSV yet.

Format (WhatsApp-style, per user project rules — short paragraphs, no tables, no emojis, no headers, dashes, <60 char lines):

```
Keyword research done. Ran X queries across N services
and M locations.

Total addressable monthly volume: ~X searches.

Top volume drivers:
- seo agentur düsseldorf — 2,400/mo, KD 62
- seo beratung köln — 880/mo, KD 55
- paid ads düsseldorf — 720/mo, KD 48

Services ranked by total volume:
- SEO: ~8,400/mo across 23 viable keywords
- Paid Ads: ~4,100/mo across 18 viable
- Website Development: ~2,200/mo across 11 viable

Locations ranked by total volume:
- Düsseldorf, Köln, Dortmund drive 68% of demand
- Essen + Duisburg add 14%
- Long-tail Tier 2 cities: 18%

Dead combinations (<10 vol, cut from sitemap): 34

Local SERP (verified, device location Frintrop):
- Map pack: business A, B, C
- Organic: 6 local businesses, 3 portals
- Median length top 10: ~1,400 words

Recommendation: build 3 services × 15 geos × 3
modifiers = ~135 viable URLs. Add 40 modifier masters.
Total ~175 pages worth building. Below the 400-page
matrix ceiling but higher ROI per page.

Ready to pick an artifact.
```

Then proceed to STEP 4.

---

## STEP 4 — Artifact selection

Ask user which artifact. Present all five with token estimates and scope.

### The five artifacts

**A — Sitemap CSV + research file**
Estimate: ~8k tokens output, ~5 min
Deliverable: full CSV with all columns (url_slug, service, modifier, location, volume, KD, intent, target_keyword, h1, meta_title, meta_description, priority) + saved Semrush research as companion CSV.

**B — Master template (populated, annotated markdown)**
Estimate: ~12k tokens output, ~5–8 min per service
Deliverable: one master landing page per service, fully populated copy, 7-block structure, inline JSON-LD schema, in the requested language. Markdown format. Not HTML.

**C — HTML wireframe, no copy (placeholders only)**
Estimate: ~6k tokens output, ~3 min per service
Deliverable: production-ready HTML skeleton with `{{placeholders}}` for all text, Hero with contact form, 7 block containers, schema script tags with placeholders. One file per service.

**D — HTML wireframe with populated copy**
Estimate: ~20k tokens output, ~10–15 min per service
Deliverable: C + B merged. Full HTML with real copy inside, ready for WordPress/Codex import. One file per service.

**E — SERP brief per target page**
Estimate: ~4k tokens output per page, ~10 Firecrawl credits per page, plus browser time (packages of max 10 queries)
Deliverable: verified local SERP (map pack, ads, organic top 10), Firecrawl metrics of the top 10 (words, H2, schema), and the targets for our page (word count, schema, H2 topics, local signals). Format: local-serp-analysis `references/serp_brief.md`. Best run before B or D, which then take their targets from it.

### How to ask

Present A, B, C, D, E with the above estimates. User picks one. If user wants multiples, produce in sequence, confirm between each.

### Multi-service / multi-page note

If user picked B, C, or D and has multiple services:
- Default: produce for first service only, confirm
- Exception: user says "all services" explicitly → produce sequentially, show each, wait for approve before next

---

## STEP 5 — Produce selected artifact

Load the relevant reference file:
- A → `references/artifact_a_sitemap.md`
- B → `references/artifact_b_master.md`
- C → `references/artifact_c_wireframe_html.md`
- D → `references/artifact_d_wireframe_populated.md`
- E → local-serp-analysis skill, `references/serp_brief.md` + `references/api_calls.md`

Then all artifacts share:
- `references/copy_blocks.md` — the 7-block structure with DE/EN specs
- `references/schema_templates.md` — JSON-LD stubs
- `references/vertical_compliance.md` — HWG, RVG, consulting, NEO rules
- `references/geo_rhein_ruhr.md` — NEO's default geo list with tiers
- `references/modifiers_de.md` / `modifiers_en.md` — default modifier lists

Save output to `/mnt/user-data/outputs/` with filename pattern:
- A: `sitemap_{vertical}_{YYYYMMDD}.csv` + `semrush_research_{vertical}_{YYYYMMDD}.csv`
- B: `master_{service}_{language}.md`
- C: `wireframe_{service}_{language}.html`
- D: `wireframe_{service}_{language}_populated.html`
- E: `serp_brief_{keyword-slug}_{point}_{YYYYMMDD}.md` + `serp_readings_{point}_{YYYYMMDD}.csv` + `page_metrics_{keyword-slug}_{YYYYMMDD}.csv`

Present files via `present_files` (claude.ai) or `SendUserFile` (Claude Code).

---

## STEP 6 — Stop

After artifact delivered:
- Short summary in chat (WhatsApp-style)
- Ask: "Another artifact from same research, or done?"
- Do not loop automatically

---

## Rules that always apply

### Rule 1: Ask before doing
STEP 1 intake is non-negotiable. No work starts without it.

### Rule 2: Research before writing
Never produce sitemap, template, or copy without STEP 2 research OR explicit user waiver ("skip research, use defaults").

### Rule 3: Token transparency
Always show token estimates at STEP 4. User decides cost/benefit.

### Rule 4: Autonomy within scope
Inside a chosen artifact: run to completion without mid-task confirmations. User already approved at STEP 4.
Between artifacts: confirm.
Between services within an artifact: confirm unless user said "all services."

### Rule 5: Language discipline
Skill internals = terse imperative. Client-facing output = polished in requested language.

### Rule 6: Vertical compliance
Apply `vertical_compliance.md` rules to every output. HWG / RVG / consulting voice / NEO service list.

### Rule 7: Right tool for each job
Follow the tool routing in STEP 2. Local rankings only from verified browser readings with device location. If the right tool is unavailable, report the gap. Never fill it with a tool marked "never".

---

## The 7-block universal skeleton (used in B and D)

1. **H1** — exact-match target keyword
2. **H2 tagline** — outcome, not feature
3. **Opening 2 sentences** — keyword in first 15 words, brand in sentence 2
4. **"Was ist / What is {keyword}?"** — definition + 4 business-effect bullets (AI-citation chunk)
5. **"Warum / Why professional {keyword}"** — 4 value blocks with bold leads
6. **"{Brand}: Wie wir / How we do {keyword}"** — authority block, 3 subsections, founder credibility
7. **CTA close** — outcome question + contact line, references hero form

Master pages: 900–1100 words. Geo pages: ~800 words, location token 2–3× max.
If a SERP brief exists for the page, its word target overrides these defaults: at least the median main-content words of the local top 10, max ~1.5 × median. Schema types used by ≥3 of the top 10 are added.

Hero on every page: always includes contact form. Name, email, phone, company, message, GDPR consent, submit.

---

## AI Search (GEO/AEO) layer — applies to B and D

Every populated page includes:
- FAQPage JSON-LD, 5–7 Q&A pairs
- HowTo JSON-LD where relevant
- Factual "Was ist X?" block written for LLM citation (clean, no marketing voice)
- Entity signals: brand + service nouns + locations, internally linkable

---

## Quality gates (applied before marking any page artifact complete)

- Focus keyword in: URL, H1, title, meta, first 100 words, one H2
- Word count hit (800 geo / 900+ master)
- Unique meta title + description
- JSON-LD required fields present
- Vertical compliance (HWG/RVG/consulting) checked
- Geo pages Tier 2/3: location token count 2–3, not more
- Hero contact form present with GDPR consent
- Any ranking or competitor claim rests on verified readings (device location, footer checked), with date and measuring point
- Word target follows the SERP brief, if one exists

---

## Files in this skill

- `SKILL.md` — this file
- `references/artifact_a_sitemap.md` — sitemap CSV spec
- `references/artifact_b_master.md` — populated master template spec
- `references/artifact_c_wireframe_html.md` — HTML placeholder wireframe spec
- `references/artifact_d_wireframe_populated.md` — HTML + copy merged spec
- `references/copy_blocks.md` — 7-block copy rules DE/EN
- `references/schema_templates.md` — JSON-LD stubs
- `references/vertical_compliance.md` — HWG, RVG, consulting, NEO rules
- `references/geo_rhein_ruhr.md` — NEO default geo list with tiers
- `references/modifiers_de.md` — default German modifiers
- `references/modifiers_en.md` — default English modifiers
- `references/semrush_browser_agent.md` — browser agent playbook for STEP 2a
- Skill `local-serp-analysis` — STEP 2b and Artifact E: tool routing, browser reading, SERP brief

Load only what the current artifact needs. Do not read everything on trigger.
