# Default German modifiers

Use when user does not supply custom modifier list.

## Universal service modifiers

- `agentur` — primary modifier, strongest intent
- `beratung` — consulting intent
- `experten` — authority intent
- `freelancer` — solo/small budget intent (optional)
- `preise` — commercial/price-compare intent
- `kosten` — price-compare intent (use instead of preise, not both)

## Superlative / qualifier modifiers

- `beste` — "beste SEO Agentur"
- `professionelle` — "professionelle SEO"
- `top` — "top SEO Agentur" (use sparingly, often low intent)

## Skip list (low value in DE market)

- `günstig` — avoid in legal/medical (RVG risk), weak intent generally
- `billig` — never
- `kostenlos` — attracts wrong audience
- `trusted` — English, doesn't localize

## Recommended default stack

For new builds without Semrush data:
1. `{service}` (base)
2. `{service}-agentur`
3. `{service}-beratung`
4. `{service}-experten`

Four variants per service. Multiply by geo. This gives you ~300-400 URLs for 3 services × 25 Tier 1+2 cities without modifier spam.

Add more only when Semrush shows distinct volume per modifier variant.

## Rhein-Ruhr specific

The term `agentur` dominates search volume in NRW B2B market. Always include.
`beratung` over-performs in Düsseldorf + Köln specifically (finance/consulting ecosystem).
