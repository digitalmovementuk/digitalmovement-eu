# JSON-LD schema templates

Inline in every populated page. Fill in placeholders before output.

## Organization (non-geo master pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{brand_name}}",
  "url": "{{canonical_url}}",
  "logo": "{{logo_url}}",
  "sameAs": [
    "{{linkedin_url}}",
    "{{instagram_url}}"
  ]
}
```

## LocalBusiness (geo pages)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{brand_name}} {{location}}",
  "url": "{{canonical_url}}",
  "image": "{{hero_image_url}}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{{location}}",
    "addressCountry": "{{country_code}}"
  },
  "areaServed": {
    "@type": "City",
    "name": "{{location}}"
  }
}
```

## Service

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "{{service_name}}",
  "provider": {
    "@type": "Organization",
    "name": "{{brand_name}}"
  },
  "areaServed": "{{location_or_region}}",
  "description": "{{meta_description}}"
}
```

## FAQPage (from Block 5)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{faq_1_question}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{faq_1_answer}}"
      }
    }
    // repeat for faq_2 through faq_N (5-7 total)
  ]
}
```

## HowTo (from Block 6, process)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{{howto_title}}",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "{{step_1_title}}",
      "text": "{{step_1_description}}"
    }
    // repeat for step_2 through step_N
  ]
}
```

## BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{home_url}}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{parent_name}}",
      "item": "{{parent_url}}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{{current_page_name}}"
    }
  ]
}
```

## Schema stack per page type

- **Master service page**: Organization + Service + FAQPage + BreadcrumbList (+ HowTo if process block)
- **Geo page**: LocalBusiness + Service + FAQPage + BreadcrumbList (+ HowTo)
- **Modifier + geo page**: same as geo page
- **Blog / thought leadership**: Article + BreadcrumbList + Author (Person schema)

## Validation note

All stubs must be wrapped:
```html
<script type="application/ld+json">
[schema JSON here]
</script>
```

Multiple scripts per page are fine. Do not merge into one.
