# Climate Select: redesign prototype

Static HTML, CSS and JS prototype for a full redesign of https://www.climateselect.co.uk/. No build step.

## Pages

| Prototype file | Live URL it replaces |
| --- | --- |
| `index.html` | https://www.climateselect.co.uk/ |
| `conservatory-solutions/index.html` | https://www.climateselect.co.uk/conservatory-solutions/ |
| `installation/index.html` | https://www.climateselect.co.uk/installation/ |
| `about/index.html` | https://www.climateselect.co.uk/about/ |
| `gallery/index.html` | https://www.climateselect.co.uk/gallery/ |
| `contact/index.html` | https://www.climateselect.co.uk/contact/ |

The URL structure matches the live site, so the redesign can launch without changing any URLs. Legal notice and privacy policy stay on the live site and are linked from the footer.

## Viewing it

GitHub shows HTML as source, so open the files from a checkout:

```
git switch prototype/climate-select-redesign
cd prototypes/climate-select-redesign
python3 -m http.server 8080    # then open http://localhost:8080
```

Opening `index.html` directly also works.

## What the prototype does

- Conversion: a survey-booking CTA in the header, hero, sticky mobile action bar and final band. Phone and email are one tap away.
- Enquiry forms validate in the browser (name, email, consent). The form is **not connected** to a handler yet. A valid submit only shows the success state.
- Gallery filters by space type, using `data-category` on each figure.
- SEO and AI search: per-page title and description, canonical URLs, Open Graph, and JSON-LD (`HVACBusiness`, `Service`, `FAQPage`, `BreadcrumbList`). Answers in the FAQs are written to be quoted directly.
- Accessibility: skip link, visible focus states, labelled forms, and reduced-motion support. Mobile layout checked at 390px with no horizontal scroll.
- Privacy: no third-party embeds (no Google Maps, no YouTube). Fonts use the system stack, so nothing loads from Google.

## Before launch

- **Noindex:** every prototype page carries `<meta name="robots" content="noindex, nofollow">`. Remove it at launch and add `robots.txt` and `sitemap.xml`.
- **Form:** connect the `action` to a real handler and check the consent wording with the client's data protection adviser.
- **Free survey conditions:** the site says the survey is free "conditions apply" but never states them. The prototype says the same. The client needs to write them down.
- **Claims to verify** (carried over from the live site, not checked by us):
  - "Usually cheaper to install than replacing the roof or insulating" and "usually cheaper, cleaner and greener" (conservatory page).
  - "Ideally suited" to planning or leasehold restrictions (home comparison table).
  - Address postcode. The live site shows "HX37LA"; the prototype uses "HX3 7LA". Confirm it.
  - Installation with a general builder or electrician without F-gas certification. This was on the live site but is left out of the prototype. It is a compliance claim that needs confirming first.
- **Gallery images:** most photos on the live site look like renders or stock, not finished installs. The prototype labels the gallery as illustrative. Swap in real project photos if they exist. Images with baked-in text or a manufacturer's logo were left out.
- **Reviews:** the live site has no customer reviews or testimonials. Add verified ones. None were invented here.
- **Images:** photos are converted copies of the live site's images, under 1200px and WebP. Replace them with licensed or commissioned photography before launch.

## Folder

```
index.html, about/, contact/, gallery/, installation/, conservatory-solutions/   pages
assets/css/site.css   shared styles (design tokens on :root)
assets/js/site.js     nav, form validation, gallery filter, reveal-on-scroll
assets/img/           WebP images and the logo
```
