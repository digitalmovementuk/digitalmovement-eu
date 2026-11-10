# Artifact A — Sitemap CSV

## Input
- STEP 1 intake (services, locations, language, vertical, brand)
- STEP 2 Semrush research CSV

## Output

Two files:

**1. `sitemap_{vertical}_{YYYYMMDD}.csv`** — the build queue.

Columns (fixed order):
```
url_slug
page_type              master | modifier_master | geo | modifier_geo
service
modifier               (empty if base)
location               (empty if non-geo)
tier                   1 | 2 | 3 (empty if non-geo)
target_keyword         exact phrase used for Semrush lookup
monthly_volume         from Semrush
kd                     keyword difficulty
intent                 I | N | C | T
h1                     usually = target_keyword, capitalized
meta_title             ≤60 chars
meta_description       ≤155 chars
priority               P0 / P1 / P2
recommended_action     build | skip | defer
notes                  optional, e.g. "Tier 1, enrich with local case study"
```

**2. `semrush_research_{vertical}_{YYYYMMDD}.csv`** — raw research data from STEP 2, saved as-is for reference.

## Filtering logic before writing sitemap

```
IF volume >= 20 → build (P0 or P1 based on tier)
IF volume 10-19 AND tier 1 → build (P1)
IF volume 10-19 AND tier 2/3 → defer (P2)
IF volume < 10 AND not tier 1 → skip
IF volume < 10 AND tier 1 → build, mark "brand signal"
IF KD > 75 → mark "long-term", still include but P2
```

Priority rules:
- P0: masters + Tier 1 geos with volume >= 20
- P1: modifier masters with volume >= 20, Tier 1 geos volume 10-19, Tier 2 geos with volume >= 20
- P2: everything else still worth including

## Meta title generation

Pattern (DE):
```
{Target Keyword} | {Brand}
```
If total >60 chars:
```
{Target Keyword} – {Short Outcome}
```

Pattern (EN):
```
{Target Keyword} | {Brand}
```
If total >60 chars:
```
{Target Keyword} — {Short Outcome}
```

## Meta description generation

DE pattern:
```
{Target keyword} für {Zielgruppe/Region}. {Nutzen in einem Satz}. Jetzt {CTA-Verb}.
```
Example:
```
SEO Agentur Düsseldorf für Mittelstand und B2B. Mehr qualifizierte Anfragen aus Google. Jetzt kostenlose Analyse anfragen.
```

EN pattern:
```
{Target keyword} for {audience/region}. {One-sentence benefit}. {CTA}.
```

Must be ≤155 chars. Include keyword verbatim in first half.

## URL slug rules

- Lowercase, hyphens only, ASCII
- German umlauts: ä→ae, ö→oe, ü→ue, ß→ss
- Pattern: `{service}[-{modifier}][-{location}]`
- Examples:
  - `seo-agentur`
  - `seo-agentur-duesseldorf`
  - `paid-ads-koeln`
  - `website-development-experts` (EN)

## Chat output after CSV generated

WhatsApp-style summary:
```
Sitemap built. Total rows: X.

Priority split:
- P0 build-first: N pages
- P1 second wave: N pages
- P2 fill long-tail: N pages
- Skipped (no volume): N

Total addressable monthly volume in sitemap: X searches/mo.
Avg KD: Y. Median: Z.

CSV saved as sitemap_{vertical}_{date}.csv.
Research saved as semrush_research_{vertical}_{date}.csv.

Next options:
- Build master templates for top services (Artifact B)
- Generate HTML wireframes (Artifact C or D)
- Refine sitemap (change filters, add locations)
```

## Token budget

- Intake + research: included in STEP 2 cost (~12k)
- CSV generation: ~4k tokens (mostly formatting, row logic)
- Summary: ~1k
- Total for Artifact A: ~8k tokens output (research already paid for in STEP 2)
