# SERP brief

One brief per target page (keyword × location). Built from verified readings only.

## Inputs

- Verified browser readings for the keyword at the page's measuring point(s)
- Firecrawl metrics for the organic top 10 of those readings (`scripts/page_metrics.mjs`)
- Optional: Serper `/maps` list for the district, Serper `/autocomplete` suggestions, SerpApi cross-check

## Aggregation

```
organic_top10      positions 1–10 from the verified reading (if 2+ readings: the most recent; note changes)
result_types       per URL: local business | directory/portal | national chain | news/info | other
words_median       median word count of the top 10 (Firecrawl, onlyMainContent)
words_range        min–max
h2_median          median H2 count
schema_share       per @type: how many of the top 10 carry it (FAQPage, LocalBusiness, Organization, ...)
map_pack           the 3 businesses with rating and review count (browser), plus the next 5 from Serper /maps
ads                count and advertisers, top and bottom
paa                People-also-ask questions, verbatim
suggestions        relevant autocomplete suggestions (districts, modifiers)
```

## Implications for the page

- Word target: at least `words_median`. Go up to ~1.5 × median only when the topic needs it. Never pad.
- Schema: include every type that ≥3 of the top 10 use, plus FAQPage if the PAA box is present.
- H2s: cover the subtopics that recur in ≥3 top-10 pages, plus the PAA questions.
- Local signals: districts and neighbourhoods from the map pack and the suggestions, 2–3 mentions, no stuffing.
- Directory-heavy SERP (≥4 portals in the top 10): flag it. The map pack and Google Business Profile matter more than the page.

## Brief format (chat, German, WhatsApp style)

Short paragraphs, dashes, no tables, no headers, no emojis, lines under 60 characters.

```
SERP-Brief „bestatter“, Messpunkt Essen-Frintrop,
gelesen am 12.11. per Browser mit Gerätestandort.

Kartenbereich:
- Betrieb A, 4,8 Sterne, 120 Bewertungen
- Betrieb B, 4,6 Sterne, 85 Bewertungen
- Betrieb C, 4,9 Sterne, 40 Bewertungen

Organisch Top 10: 6 lokale Betriebe, 3 Portale,
1 Ratgeber. Mittlere Länge 1.400 Wörter
(600 bis 5.400), meist 4 bis 6 H2.

Schema: 5 von 10 mit LocalBusiness, 2 mit FAQPage.

Häufige Fragen bei Google: ...

Für unsere Seite: rund 1.400 Wörter, LocalBusiness
plus FAQPage, Frintrop und Borbeck je 2 bis 3 Mal.
```

Then save the reading log and the metrics table as files next to the brief (CSV), so the numbers can be checked.
