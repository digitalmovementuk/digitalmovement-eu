# Artifact D — HTML Wireframe with Populated Copy

## What this is
Artifact C's HTML skeleton + Artifact B's copy, merged.
Every `{{placeholder}}` replaced with real copy, real schema, real URLs.
Production-ready import for WordPress, Codex, or direct deploy.

## What it is NOT
- Not a design (no Tailwind styling, no hero image picks — those are dev decisions)
- Not just copy (that's B)
- Not a skeleton (that's C)

## Prerequisite
Do NOT run D without STEP 2 research complete. Copy quality depends on volume + intent signals.

## Output

One `.html` file per service. Filename: `wireframe_{service}_{language}_populated.html`.

## Generation logic

1. Start from Artifact C template (same structure, same 7 blocks, same hero form)
2. Load `copy_blocks.md` rules
3. Load `vertical_compliance.md`
4. Load `schema_templates.md` and fill stubs
5. For each placeholder in C:
   - If it's copy → generate in requested language following 7-block rules
   - If it's schema → fill JSON with real values
   - If it's an image URL → leave as `{{asset_placeholder}}` (still dev's job to pick)
   - If it's a URL (canonical, phone, email) → use user-supplied or flag `{{to_fill}}`

## Asset placeholders that stay as placeholders

Even in D, these remain `{{placeholders}}` because they're not text:
- `{{hero_image}}`
- `{{brand_logo}}`
- `{{trust_logo_1}}` through `{{trust_logo_4-6}}`
- `{{testimonial_1_photo}}` through `{{testimonial_3_photo}}`
- `{{founder_photo}}`
- `{{og_image}}`
- `{{favicon}}`

Plus these URLs/endpoints:
- `{{canonical_url}}` — unless user supplied base domain
- `{{form_endpoint}}` — form backend URL
- `{{phone_number}}`, `{{email}}`, `{{whatsapp_link}}` — unless user supplied

Everything else = real content.

## Copy generation rules

### Hero
- `{{hero_h1}}` = exact match keyword (e.g. "SEO Agentur Düsseldorf" or "SEO Agency Düsseldorf")
- `{{hero_subline}}` = outcome-framed, 6-10 words
- `{{hero_lead_paragraph}}` = 2 sentences, keyword in first 15 words, brand in sentence 2

### Block 1 (Was ist / What is)
- H2: "Was ist {keyword}?" or "What is {keyword}?"
- Intro: 2-3 factual sentences, LLM-citation friendly
- 4 bullet points = business outcomes, not features

### Block 2 (Warum / Why)
- 4 value subblocks
- Each: bold lead (2-4 words) + 2-sentence body
- Default leads for NEO:
  DE: Strategische Klarheit, Mess- und Nachweisbarkeit, Skalierbarkeit über Kanäle, Zukunftsfähigkeit (GEO/AEO-Ready)
  EN: Strategic Clarity, Measurable Results, Cross-Channel Scalability, Future-Ready (GEO/AEO)

### Block 3 (Testimonials)
- If user supplied testimonials: use them
- If not: generate 3 generic quotes + mark as `{{testimonial_N_replace_before_publish}}`
- NEVER fabricate named quotes with real-sounding companies
- Vertical rules: Medical = no outcome testimonials, Legal = no result testimonials

### Block 4 (Authority)
- 3 subblocks: approach (4 bullets), difference (3 bullets), value (4 bullets)
- Founder credibility paragraph:
  - NEO: BCG background reference required
  - Other: founder bio paragraph from STEP 1 input

### Block 5 (FAQ)
- 5-7 Q&A pairs
- Questions drawn from: Google People Also Ask (if research step surfaced them) + common objections for the vertical
- Answers: 2-4 sentences, factual, citation-friendly
- Always populate FAQPage JSON-LD with matching data

### Block 6 (Process)
- 5 numbered steps
- Each: title (3-5 words) + 1-2 sentence description
- Always populate HowTo JSON-LD with matching data

### Block 7 (CTA close)
- H2: outcome question
- 1-2 paragraph persuasive close
- Reference hero form explicitly: "Nutzen Sie das Formular oben" / "Use the form above"
- Include phone + email + WhatsApp fallback

## Schema population

Fill all 5 JSON-LD blocks from `schema_templates.md`:
- Organization or LocalBusiness
- Service
- BreadcrumbList
- FAQPage (matches Block 5 Q&A exactly)
- HowTo (matches Block 6 steps exactly)

FAQPage and HowTo MUST match visible content exactly — Google penalizes schema/content mismatch.

## Geo page handling

If user specified a location for this artifact:
- Hero H1 includes location
- Meta title includes location
- Body copy includes location 2-3 times (Tier 2/3 rule) or 4-6 times with enrichment (Tier 1)
- Add LocalBusiness schema instead of Organization
- Tier 1: add a local market paragraph in Block 1 or 4

## Token budget

Per service: ~20k tokens output
- HTML structure: 4k (same as C)
- Full populated copy: 12k
- Schema JSON filled: 2k
- Quality gate pass: 2k

For 3 services: ~60k tokens. ⚠️ Large. Confirm before running all 3.

## Post-write quality gate

Every gate from Artifact B + every gate from Artifact C:
- 7 blocks populated
- Hero form with GDPR consent, real label text
- Keyword in URL, H1, title, meta, first 100 words, one H2
- Word count: 900-1100 (master) or 800+ (geo)
- Unique meta title + description
- All 5 JSON-LD filled with REAL data (no empty stubs)
- FAQPage JSON matches Block 5 Q&A verbatim
- HowTo JSON matches Block 6 steps verbatim
- Vertical compliance passed (HWG, RVG, consulting, NEO)
- Hero contact form referenced in Block 7 CTA close
- Language attribute correct on `<html>`
- Canonical URL set or flagged

If any gate fails → fix, do not ship.

## Delivery summary (WhatsApp-style chat output)

```
Wireframe D built: wireframe_{service}_{language}_populated.html

Target keyword: {keyword}
Volume: {X}/mo, KD: {Y}
Word count: {N} words
Schema blocks: 5 (Org/LocalBiz, Service, Breadcrumb, FAQ, HowTo)

Still needs from dev/designer:
- {{hero_image}}, {{founder_photo}}, {{trust_logo_*}}
- Form endpoint URL
- Phone, email, WhatsApp link

Ready to import to WordPress or Codex.
```
