# Artifact C — HTML Wireframe (placeholders, no copy)

## What this is
Production-ready HTML skeleton. All copy = `{{placeholder}}` tokens.
One file per service. Dev-ready for VS Code / Codex handoff.
NOT a design mockup. Structural HTML only with minimal CSS classes.

## What it is NOT
- Not a visual design (no colors, no images, no Tailwind polish)
- Not populated copy (that's D)
- Not annotated markdown (that's B)

## Output

One `.html` file per service. Filename: `wireframe_{service}_{language}.html`.

## File structure

```html
<!DOCTYPE html>
<html lang="{{language}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{meta_title}}</title>
  <meta name="description" content="{{meta_description}}">
  <link rel="canonical" href="{{canonical_url}}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{og_title}}">
  <meta property="og:description" content="{{og_description}}">
  <meta property="og:image" content="{{og_image}}">
  <meta property="og:url" content="{{canonical_url}}">
  <meta property="og:type" content="website">

  <!-- Schema: Organization / LocalBusiness -->
  <script type="application/ld+json">
  {{schema_organization_or_localbusiness}}
  </script>

  <!-- Schema: Service -->
  <script type="application/ld+json">
  {{schema_service}}
  </script>

  <!-- Schema: BreadcrumbList -->
  <script type="application/ld+json">
  {{schema_breadcrumb}}
  </script>

  <!-- Schema: FAQPage (populated from Block 5) -->
  <script type="application/ld+json">
  {{schema_faqpage}}
  </script>

  <!-- Schema: HowTo (populated from Block 6) -->
  <script type="application/ld+json">
  {{schema_howto}}
  </script>
</head>
<body>

<!-- ========== NAV ========== -->
<nav class="nav">
  <a href="/" class="nav-logo">{{brand_logo}}</a>
  <ul class="nav-links">
    <li><a href="/leistungen/">{{nav_services}}</a></li>
    <li><a href="/branchen/">{{nav_industries}}</a></li>
    <li><a href="/projekte/">{{nav_projects}}</a></li>
    <li><a href="/ueber-uns/">{{nav_about}}</a></li>
    <li><a href="/kontakt/" class="nav-cta">{{nav_contact_cta}}</a></li>
  </ul>
</nav>

<!-- ========== HERO ========== -->
<section class="hero">
  <div class="hero-content">
    <h1>{{hero_h1}}</h1>
    <h2 class="hero-subline">{{hero_subline}}</h2>
    <p class="hero-lead">{{hero_lead_paragraph}}</p>

    <div class="trust-bar">
      <!-- 4-6 trust logos -->
      <img src="{{trust_logo_1}}" alt="{{trust_alt_1}}">
      <img src="{{trust_logo_2}}" alt="{{trust_alt_2}}">
      <img src="{{trust_logo_3}}" alt="{{trust_alt_3}}">
      <img src="{{trust_logo_4}}" alt="{{trust_alt_4}}">
    </div>
  </div>

  <!-- HERO CONTACT FORM — always present -->
  <aside class="hero-form">
    <h3>{{hero_form_headline}}</h3>
    <form action="{{form_endpoint}}" method="POST">
      <label>
        {{form_label_name}}
        <input type="text" name="name" required>
      </label>
      <label>
        {{form_label_email}}
        <input type="email" name="email" required>
      </label>
      <label>
        {{form_label_phone}}
        <input type="tel" name="phone">
      </label>
      <label>
        {{form_label_company}}
        <input type="text" name="company">
      </label>
      <label>
        {{form_label_message}}
        <textarea name="message" rows="4" required></textarea>
      </label>
      <label class="consent">
        <input type="checkbox" name="gdpr" required>
        {{form_gdpr_consent_text}}
        <a href="/datenschutz/">{{form_privacy_link_label}}</a>
      </label>
      <button type="submit">{{form_cta_primary}}</button>
    </form>
  </aside>
</section>

<!-- ========== BLOCK 1: Was ist / What is ========== -->
<section class="block block-definition">
  <h2>{{block_1_h2}}</h2>
  <p>{{block_1_intro}}</p>
  <ul>
    <li>{{block_1_bullet_1}}</li>
    <li>{{block_1_bullet_2}}</li>
    <li>{{block_1_bullet_3}}</li>
    <li>{{block_1_bullet_4}}</li>
  </ul>
</section>

<!-- ========== BLOCK 2: Warum / Why ========== -->
<section class="block block-value">
  <h2>{{block_2_h2}}</h2>
  <div class="value-grid">
    <div class="value-item">
      <strong>{{value_1_lead}}.</strong>
      <p>{{value_1_body}}</p>
    </div>
    <div class="value-item">
      <strong>{{value_2_lead}}.</strong>
      <p>{{value_2_body}}</p>
    </div>
    <div class="value-item">
      <strong>{{value_3_lead}}.</strong>
      <p>{{value_3_body}}</p>
    </div>
    <div class="value-item">
      <strong>{{value_4_lead}}.</strong>
      <p>{{value_4_body}}</p>
    </div>
  </div>
</section>

<!-- ========== BLOCK 3: Social Proof ========== -->
<section class="block block-social-proof">
  <h2>{{block_3_h2}}</h2>
  <div class="testimonial-grid">
    <article class="testimonial">
      <blockquote>{{testimonial_1_quote}}</blockquote>
      <figcaption>
        <strong>{{testimonial_1_name}}</strong>
        {{testimonial_1_role}}, {{testimonial_1_company}}
      </figcaption>
      <img src="{{testimonial_1_photo}}" alt="{{testimonial_1_name}}">
    </article>
    <!-- repeat for testimonial_2, testimonial_3 -->
  </div>
</section>

<!-- ========== BLOCK 4: Authority (Brand difference) ========== -->
<section class="block block-authority">
  <h2>{{block_4_h2}}</h2>

  <div class="authority-subblock">
    <h3>{{subblock_4a_title}}</h3>
    <ul>
      <li>{{approach_bullet_1}}</li>
      <li>{{approach_bullet_2}}</li>
      <li>{{approach_bullet_3}}</li>
      <li>{{approach_bullet_4}}</li>
    </ul>
  </div>

  <div class="authority-subblock">
    <h3>{{subblock_4b_title}}</h3>
    <ul>
      <li>{{difference_bullet_1}}</li>
      <li>{{difference_bullet_2}}</li>
      <li>{{difference_bullet_3}}</li>
    </ul>
  </div>

  <div class="authority-subblock">
    <h3>{{subblock_4c_title}}</h3>
    <ul>
      <li>{{value_bullet_1}}</li>
      <li>{{value_bullet_2}}</li>
      <li>{{value_bullet_3}}</li>
      <li>{{value_bullet_4}}</li>
    </ul>
  </div>

  <div class="founder-credibility">
    <img src="{{founder_photo}}" alt="{{founder_name}}">
    <p>{{founder_bio_paragraph}}</p>
  </div>
</section>

<!-- ========== BLOCK 5: FAQ (AI Search critical) ========== -->
<section class="block block-faq">
  <h2>{{block_5_h2}}</h2>

  <details>
    <summary>{{faq_1_question}}</summary>
    <p>{{faq_1_answer}}</p>
  </details>
  <details>
    <summary>{{faq_2_question}}</summary>
    <p>{{faq_2_answer}}</p>
  </details>
  <details>
    <summary>{{faq_3_question}}</summary>
    <p>{{faq_3_answer}}</p>
  </details>
  <details>
    <summary>{{faq_4_question}}</summary>
    <p>{{faq_4_answer}}</p>
  </details>
  <details>
    <summary>{{faq_5_question}}</summary>
    <p>{{faq_5_answer}}</p>
  </details>
  <!-- 5-7 total. Add details blocks 6 and 7 if needed. -->
</section>

<!-- ========== BLOCK 6: Process ========== -->
<section class="block block-process">
  <h2>{{block_6_h2}}</h2>
  <ol class="process-steps">
    <li>
      <h3>{{step_1_title}}</h3>
      <p>{{step_1_description}}</p>
    </li>
    <li>
      <h3>{{step_2_title}}</h3>
      <p>{{step_2_description}}</p>
    </li>
    <li>
      <h3>{{step_3_title}}</h3>
      <p>{{step_3_description}}</p>
    </li>
    <li>
      <h3>{{step_4_title}}</h3>
      <p>{{step_4_description}}</p>
    </li>
    <li>
      <h3>{{step_5_title}}</h3>
      <p>{{step_5_description}}</p>
    </li>
  </ol>
</section>

<!-- ========== BLOCK 7: CTA Close ========== -->
<section class="block block-cta-close">
  <h2>{{cta_h2}}</h2>
  <p>{{cta_paragraph}}</p>
  <div class="cta-actions">
    <a href="#hero-form" class="btn-primary">{{cta_primary_button}}</a>
    <p class="cta-fallback">
      {{cta_phone_label}} <a href="tel:{{phone_number}}">{{phone_number_display}}</a>
      ·
      {{cta_email_label}} <a href="mailto:{{email}}">{{email}}</a>
      ·
      <a href="{{whatsapp_link}}">WhatsApp</a>
    </p>
  </div>
</section>

<!-- ========== FOOTER ========== -->
<footer class="footer">
  <div class="footer-col">
    <h4>{{footer_col_1_title}}</h4>
    <!-- links -->
  </div>
  <div class="footer-col">
    <h4>{{footer_col_2_title}}</h4>
    <!-- links -->
  </div>
  <div class="footer-col">
    <h4>{{footer_col_3_title}}</h4>
    <address>
      {{footer_address}}
    </address>
  </div>
  <div class="footer-legal">
    <a href="/impressum/">{{footer_imprint}}</a>
    <a href="/datenschutz/">{{footer_privacy}}</a>
    <a href="/agb/">{{footer_terms}}</a>
  </div>
</footer>

</body>
</html>
```

## Placeholder conventions

- `{{hero_*}}` — hero block
- `{{block_N_*}}` — numbered body block
- `{{form_*}}` — form field
- `{{schema_*}}` — JSON-LD stub (populate from `schema_templates.md`)
- `{{nav_*}}`, `{{footer_*}}` — chrome
- All placeholders use `snake_case` inside `{{ }}`

## Delivery notes

Alongside the HTML, output a second file:
`wireframe_{service}_{language}_placeholder_manifest.txt`

Lists every `{{placeholder}}` used with:
- Placeholder name
- Expected content type (text, image URL, JSON object, number)
- Character limit if applicable
- Notes (e.g. "keyword must appear verbatim", "≤60 chars")

This is the handoff doc to Codex or copywriter.

## Token budget

Per service: ~6k tokens output
- HTML structure: 4k
- Placeholder manifest: 1.5k
- Schema stubs: 0.5k

For 3 services: ~18k tokens.

## Post-write quality gate

- All 7 blocks present
- Hero form present with GDPR consent
- All 5 JSON-LD schema script tags present (may be empty stubs)
- Language attribute on `<html>` correct
- Canonical URL present
- OG tags present
- Placeholder manifest generated
