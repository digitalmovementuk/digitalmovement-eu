# Copy Blocks — 7-block structure (DE + EN)

Shared by Artifacts B and D. Load this file when writing populated copy.

## Word count targets

- Master page total: 900-1100 words
- Geo page total: ~800 words (Tier 2/3) or 900+ (Tier 1 with enrichment)
- Hero: 50-80 words (not counting form)
- Block 1: 120-150 words
- Block 2: 200-250 words
- Block 3: 100-150 words (3 testimonials)
- Block 4: 250-300 words
- Block 5: 300-400 words (5-7 FAQ pairs)
- Block 6: 150-200 words
- Block 7: 80-120 words

## Block-by-block rules

### HERO

- **H1**: exact-match target keyword. Capitalize German nouns correctly. No modifiers added that aren't in the keyword.
- **H2 subline**: outcome framing. 6-10 words. Never restate H1. Never list features.
  - ❌ "Professional SEO Services for Your Business"
  - ✅ "Mehr qualifizierte Anfragen aus dem organischen Google-Traffic"
  - ✅ "Predictable pipeline from organic search"
- **Lead paragraph**: 2 sentences.
  - Sentence 1: MUST include exact-match keyword in first 15 words
  - Sentence 2: MUST name brand + concrete benefit
  - No hedging ("we can help", "we try to")
  - No filler ("in today's fast-paced digital world")

### BLOCK 1 — Was ist / What is

- H2 pattern DE: "Was ist {keyword}?"
- H2 pattern EN: "What is {keyword}?"
- Intro: 2-3 factual sentences. **Written for LLM citation.** No "we", no "our", no sales voice. Neutral encyclopedia tone.
- 4 bullets: business outcomes, not features.
  - ❌ "Keyword research and on-page optimization"
  - ✅ "Qualified leads without ad budget"
  - ✅ "Predictable organic traffic growth over 6-12 months"

### BLOCK 2 — Warum / Why

- H2 pattern DE: "Warum professionelles {keyword} entscheidend ist"
- H2 pattern EN: "Why professional {keyword} matters"
- 4 value subblocks. Each:
  - Bold lead (2-4 words, period)
  - Body: 2 sentences explaining the value in business terms

Default leads (NEO — adapt for other verticals):

**DE:**
1. Strategische Klarheit.
2. Mess- und Nachweisbarkeit.
3. Skalierbarkeit über Kanäle.
4. Zukunftsfähigkeit (GEO/AEO-Ready).

**EN:**
1. Strategic Clarity.
2. Measurable Results.
3. Cross-Channel Scalability.
4. Future-Ready (GEO/AEO).

### BLOCK 3 — Social Proof

- 3 testimonials OR 3 mini case study cards
- Each testimonial: quote + name + role + company
- Fabrication rule: NEVER invent named testimonials. If user didn't supply, mark as `{{testimonial_N_replace_before_publish}}` and show placeholder structure.
- Medical vertical: no outcome testimonials ("my teeth look amazing"). Only process ("the practice was welcoming, professional").
- Legal vertical: no result testimonials ("we won the case"). Only process ("clear communication throughout").

### BLOCK 4 — Authority

- H2 pattern DE: "{Brand}: Wie wir {keyword} anders machen"
- H2 pattern EN: "{Brand}: How we do {keyword} differently"

Three subsections:

**4a — End-to-End-Ansatz / End-to-End Approach**
4 bullets covering: strategy → execution → measurement → iteration

**4b — Der {Brand}-Unterschied / The {Brand} Difference**
3 bullets covering what makes this brand specifically distinct. For NEO: BCG founder background, peer-to-peer voice, AI-Search-first approach.

**4c — Was Sie konkret davon haben / What you get**
4 bullets covering concrete client-side outcomes.

**Founder credibility paragraph**: 2-3 sentences. For NEO, must reference BCG background explicitly. For other clients, pull from STEP 1 intake.

### BLOCK 5 — FAQ (AI Search critical)

- 5-7 Q&A pairs
- H2 pattern DE: "Häufige Fragen zu {keyword}"
- H2 pattern EN: "Frequently asked questions about {keyword}"

Question sources:
1. Google People Also Ask (if surfaced in research)
2. Common objections for the vertical
3. Pricing questions (handle carefully per RVG if legal)
4. Timeline questions (always ask-worthy)
5. "How is this different from X" questions

Answer format:
- 2-4 sentences each
- Factual first, persuasive second
- Include keyword at least once across FAQ block
- NO "We believe that..." or "In our opinion..." — use declarative voice
- Match `FAQPage` JSON-LD exactly — schema text = visible text

Sample question patterns:

**DE:**
- "Was kostet {keyword}?"
- "Wie lange dauert {keyword}?"
- "Worin unterscheidet sich {Brand} von anderen Agenturen?"
- "Welche Ergebnisse kann ich erwarten?"
- "Ist {keyword} für kleine Unternehmen geeignet?"

**EN:**
- "How much does {keyword} cost?"
- "How long does {keyword} take?"
- "What makes {Brand} different?"
- "What results can I expect?"
- "Is {keyword} right for small businesses?"

### BLOCK 6 — Process

- H2 pattern DE: "So arbeiten wir"
- H2 pattern EN: "How we work"
- 5 numbered steps
- Each step: title (3-5 words) + 1-2 sentence description
- Match `HowTo` JSON-LD exactly

Default NEO SEO process steps (adapt per service):

**DE:**
1. Analyse & Strategie
2. Technisches Fundament
3. Content & Autorität
4. Monitoring & Anpassung
5. Skalierung

**EN:**
1. Audit & Strategy
2. Technical Foundation
3. Content & Authority
4. Monitoring & Adjustment
5. Scale

### BLOCK 7 — CTA Close

- H2: outcome question
  - DE: "Bereit, Ihre {Outcome} zu {Verb}?"
  - EN: "Ready to {verb} your {outcome}?"
- Body: 1-2 paragraphs
- Reference hero form explicitly:
  - DE: "Nutzen Sie das Formular oben für eine kostenlose Ersteinschätzung."
  - EN: "Use the form above for a free initial assessment."
- Fallback contact line: phone + email + WhatsApp

## Language voice discipline

### German ("Wir" form)

- Always "wir" / "Sie" (formal) — never "du", never "ich"
- Active voice preferred
- Short sentences. 15-25 words typical. Avoid nested subclauses.
- Loanwords: keep "SEO", "AI Search", "Paid Ads", "Content", "Strategie"
- Avoid: "großartig", "genial", "fantastisch", exclamation marks, rhetorical questions mid-paragraph
- Titles: follow German capitalization (nouns capitalized)
- No emojis. No em-dashes used as decoration.

### English ("we")

- First-person plural
- Short sentences. 12-20 words typical.
- Avoid: "great", "amazing", "awesome", exclamation marks, "unlock", "unleash", "revolutionize", "cutting-edge", "best-in-class"
- Title case for H1 and H2
- No emojis

## Keyword placement checklist (applies every page)

- [ ] URL slug
- [ ] H1 (exact match)
- [ ] Meta title (first half)
- [ ] Meta description (first half)
- [ ] First 100 words of body
- [ ] At least one H2
- [ ] Alt text of hero image (placeholder ok)

## Geo token placement (for geo pages only)

Tier 2/3 (template pages):
- Location name in H1
- Location name in meta title + meta description
- Location name 2-3× in body, positioned:
  - Hero lead paragraph (sentence 2)
  - Middle of Block 4 authority
  - Optional: Block 7 CTA

NEVER exceed 3× body mentions. Triggers doorway-page detection.

Tier 1 (enriched):
- Above rules PLUS
- 1 paragraph referencing local market context (industry mix, economic character)
- 1 reference to a local case study if exists (flag `{{local_case_study}}` if none)
- 1 city-specific asset placeholder

## Output format conventions

- Markdown files: standard markdown, no HTML tags except inside `<script>` for JSON-LD
- HTML files: semantic HTML5, minimal classes, no Tailwind, no inline styles
- JSON-LD: proper indentation, valid JSON, no trailing commas
