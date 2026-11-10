# Artifact B — Master Template (populated, annotated markdown)

## What this is
One fully populated master service landing page. Real copy, not placeholders.
Format: annotated markdown with inline JSON-LD schema.
Purpose: reference artifact per service. Reused across all geo permutations.

## Input
- STEP 1 intake (language, vertical, brand, USPs, founder credentials)
- STEP 2 research (volume data informs keyword choice if user didn't specify)
- Target service (user picks from their service list)

## Ask before writing
"Which service should I write the master for? Options: {service list}. Pick one."

Only produce multiple if user says "all services" explicitly.

## Output structure

One `.md` file per service. Filename: `master_{service}_{language}.md`.

File contents:

```markdown
---
url_slug: {service}-{primary-modifier}
page_type: modifier_master
service: {service}
modifier: {primary_modifier}
target_keyword: {exact match}
language: {de|en}
vertical: {vertical}
monthly_volume: {from research}
kd: {from research}
word_count: 900-1100
---

# {Exact match target keyword}

## {Outcome-framed H2 tagline}

{Opening paragraph — 2 sentences. Keyword in first 15 words. Brand in sentence 2.}

---

## Was ist {keyword}? / What is {keyword}?

{Definition, 2-3 sentences, AI-citation friendly. No marketing fluff. Factual.}

- {Business effect 1}
- {Business effect 2}
- {Business effect 3}
- {Business effect 4}

---

## Warum professionelles {keyword} entscheidend ist / Why professional {keyword} matters

**{Value lead 1}.** {2-sentence explanation}

**{Value lead 2}.** {2-sentence explanation}

**{Value lead 3}.** {2-sentence explanation}

**{Value lead 4}.** {2-sentence explanation}

---

## Was unsere Kunden sagen / What our clients say
[Social proof block — 3 testimonials. If user hasn't supplied: flag as {{testimonial_placeholder_1-3}}]

---

## {Brand}: Wie wir {keyword} anders machen / How we do {keyword} differently

### End-to-End-Ansatz / End-to-End Approach
- {Approach point 1}
- {Approach point 2}
- {Approach point 3}
- {Approach point 4}

### Der {Brand}-Unterschied / The {Brand} Difference
- {Difference point 1}
- {Difference point 2}
- {Difference point 3}

### Was Sie konkret davon haben / What you get
- {Concrete value 1}
- {Concrete value 2}
- {Concrete value 3}
- {Concrete value 4}

{Founder credibility paragraph — BCG reference for NEO, equivalent for others. 2-3 sentences.}

---

## Häufige Fragen / Frequently Asked Questions

### {Question 1}?
{Answer 1 — 2-4 sentences, factual, citation-friendly}

### {Question 2}?
{Answer 2}

### {Question 3}?
{Answer 3}

### {Question 4}?
{Answer 4}

### {Question 5}?
{Answer 5}

[5-7 Q&A pairs total]

---

## So arbeiten wir / How we work

1. **{Step 1 title}** — {1-2 sentence description}
2. **{Step 2 title}** — {1-2 sentence description}
3. **{Step 3 title}** — {1-2 sentence description}
4. **{Step 4 title}** — {1-2 sentence description}
5. **{Step 5 title}** — {1-2 sentence description}

---

## {Outcome-framed CTA H2}

{1-2 paragraph persuasive close. Reference hero contact form. Include phone + email fallback.}

---

## Schema markup (inline JSON-LD)

<!-- Organization -->
<script type="application/ld+json">
{ ... filled Organization JSON ... }
</script>

<!-- Service -->
<script type="application/ld+json">
{ ... filled Service JSON ... }
</script>

<!-- FAQPage (from FAQ block) -->
<script type="application/ld+json">
{ ... filled FAQPage JSON with all 5-7 Q&A ... }
</script>

<!-- HowTo (from process block) -->
<script type="application/ld+json">
{ ... filled HowTo JSON ... }
</script>

<!-- BreadcrumbList -->
<script type="application/ld+json">
{ ... filled BreadcrumbList JSON ... }
</script>
```

## Copy rules

Load `copy_blocks.md` for:
- Word count per block
- Keyword density rules
- DE vs EN voice
- Formatting conventions

Load `vertical_compliance.md` for:
- HWG / RVG / consulting compliance rules
- NEO-specific voice + founder credentials

Load `schema_templates.md` for:
- JSON-LD stubs to fill in

## Token budget

Per master page: ~12k tokens output
- Copy writing: 8k
- Schema generation: 2k
- Annotations + frontmatter: 1k
- Quality gate check: 1k

For 3 services: ~36k tokens.
Batch confirmation required before running 3 in sequence.

## Post-write quality gate

Before marking complete:
- Keyword in URL, H1, title, meta, first 100 words, one H2
- Word count 900-1100
- Unique meta title and meta description
- All 5 JSON-LD schemas present
- Vertical compliance flags (HWG no outcome claims, RVG no cheap-price, etc.)
- Hero contact form referenced in CTA close

If any gate fails → fix, do not ship.
