# Default English modifiers

Use when user does not supply custom modifier list.

## Universal service modifiers

- `agency` — primary modifier, strongest intent
- `consultant` / `consulting` — consulting intent
- `experts` — authority intent
- `company` — alternative to agency
- `services` — broad intent
- `specialists` — authority intent
- `freelancer` — solo/small budget intent (optional)

## Commercial intent modifiers

- `pricing` / `cost` — price-compare intent
- `packages` — productized intent

## Superlative / qualifier modifiers

- `best` — "best SEO agency"
- `top` / `top-rated`
- `trusted`
- `professional`

## Skip list (low value)

- `cheap` — attracts wrong audience
- `free` — attracts wrong audience
- `#1` — spam signal

## Recommended default stack

For new builds without volume data:
1. `{service}` (base)
2. `{service}-agency`
3. `{service}-consultant`
4. `{service}-experts`

Four variants per service. Multiply by geo.

Add more only when volume data shows distinct search intent per modifier.
