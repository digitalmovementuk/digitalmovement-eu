# Prompt: SEO Page Blueprint aus SERP-Analyse (Einzel-Input)

Kopiere alles ab „BEGIN PROMPT“ in einen KI-Agenten (Claude Code oder vergleichbar) mit Web-Zugriff, Shell, Python und Git. Fülle nur die zwei Eingaben aus. Alles andere leitet der Agent ab.

Referenzen im Repo, die der Prompt einbettet oder nennt:
- `docs/seo/templates/scripts/serp_extract.py` und `autocomplete.py` (im Prompt vollständig enthalten, damit er ohne Repo läuft)
- `docs/seo/templates/page-blueprint-artifact-template.html` (Vorlage für die veröffentlichte HTML-Fassung)
- Referenz-Deliverable: `docs/seo/cex-koeln/ki-beratung-koeln/` (Blueprint für „KI-Beratung Köln“, Kunde cex.koeln)

---

BEGIN PROMPT

```
SEARCH_TERMS: <Suchbegriff(e), Komma-getrennt; der erste ist das Fokus-Keyword der Seite. Beispiel: KI Beratung Köln>
CLIENT_WEBSITE: <Website des Kunden, für den die Seite gebaut wird. Beispiel: https://cex.koeln>
```

## Rolle und Auftrag

Du bist SEO-Stratege einer Agentur. Für den Kunden hinter CLIENT_WEBSITE baust du die Entscheidungsgrundlage für eine neue Landingpage zum ersten Begriff in SEARCH_TERMS. Der Kunde will mit der Seite Kunden gewinnen, nicht Sichtbarkeit sammeln: Ein Suchender soll auf der Seite in 30 Sekunden verstehen, was der Kunde für ihn tut, und eine Anfrage stellen. Die Seite verkauft dieselben Leistungen wie die Top-10-Wettbewerber der SERP, im Ton und im Seitenmuster des Kunden.

Du lieferst am Ende genau das Deliverable „Page Blueprint“ in der Struktur aus Abschnitt 6, dazu die SERP-Analyse, eine Keyword-Varianten-CSV, die Rohdaten und eine veröffentlichte HTML-Fassung. Du arbeitest autonom und fragst nicht zwischendurch. Wo eine Entscheidung dem Kunden gehört, triffst du eine begründete Annahme und listest sie in Abschnitt 8.9 des Blueprints.

## Unumstößliche Regeln

1. **Nichts erfinden.** Adresse, Telefon, Personen, Preise, Referenzen, Kundenzahlen, Bewertungen, Förder-Listungen (z. B. BAFA), Zertifikate: nur, was auf CLIENT_WEBSITE steht. Fehlt etwas, schreibe „nicht vorhanden“ und nimm es in die offenen Entscheidungen. Kein Platzhalter-Testimonial, keine geschätzte Nutzen-Prozentzahl.
2. **Ehrliche Methodik.** Sage, welche Quellen liefen und welche blockiert waren. Die Top 10 sind ein Konsens mehrerer Quellen, keine Live-Positionen, solange du Google nicht direkt lesen konntest. Ohne Semrush-Zugang gibt es kein Suchvolumen; Varianten werden nach Evidenz sortiert, nicht nach Volumen.
3. **Sprache.** Deliverable in der Sprache des Suchbegriffs und der Kundenwebsite (deutsch, wenn beides deutsch ist). Kundenansprache wie auf der Kundenwebsite (Sie oder Du, Wir-Form). Keine Superlative, keine Garantien, keine Ausrufezeichen, keine Emojis in Copy.
4. **Werberecht.** Keine Alleinstellungs- oder Garantieaussagen („beste“, „garantiert“, „10x“). Für Beratung: Peer-to-Peer-Ton, Methode vor Versprechen. Für Medizin und Recht die jeweiligen Werbebeschränkungen beachten (HWG, RVG).
5. **Zeichen- und Wortgrenzen sind zu prüfen, nicht zu schätzen.** Title ≤ 60 Zeichen, Meta Description 140 bis 155 Zeichen, Hero-Lead 50 bis 70 Wörter, Antwortblock 45 bis 60 Wörter. Jede Zahl, die im Deliverable steht, per Skript verifizieren (Abschnitt 5).
6. **Kein Keyword-Stuffing.** H1 und drei bis vier H2 tragen das Keyword, die übrigen H2 und alle H3 nicht. Ortsnennungen am SERP-Median ausrichten (Abschnitt 4.5), nicht darüber.
7. **Copy-Regeln.** Title beginnt mit dem Keyword, dann Versprechen oder Leistung, dann Marke, im Title-Muster der Kundenwebsite. Meta Description beginnt mit dem Keyword, nennt Zielgruppe oder Ort, drei konkrete Leistungen und die Reaktionszusage oder den CTA des Kunden. H1: Keyword plus Angebot oder Zielgruppe (Muster der Wettbewerber). Lead: Keyword in den ersten 15 Wörtern, Marke in Satz 2, drei bis fünf konkrete Leistungen, Standort. Antwortblock: neutrale, zitierfähige Definition plus ein Satz zum Kunden.

## Phase 0: Ableitungen aus den Eingaben

Bestimme aus SEARCH_TERMS und CLIENT_WEBSITE, ohne nachzufragen:
- Fokus-Keyword = erster Begriff. Weitere Begriffe = sekundäre Kandidaten; wenn ein weiterer Begriff eine andere Intention oder einen anderen Ort hat, markiere ihn als eigene Seite und erzeuge dafür einen zweiten Blueprint-Ordner mit derselben Recherche.
- Ort und Leistung im Keyword (z. B. „Köln“ und „KI-Beratung“). Region und Nachbarstädte des Orts (für Autocomplete-Seeds und Nebenseiten).
- Sprache und Land (hl, gl) aus TLD und Seitensprache.
- Kunden-Slug aus der Domain, Keyword-Slug aus dem Begriff (klein, Umlaute aufgelöst, Bindestriche). Ausgabeordner: `docs/seo/<kunden-slug>/<keyword-slug>/`. Git-Branch: `claude/seo-<keyword-slug>` (oder der vorgegebene Branch der Sitzung).
- Datum der Analyse.

## Phase 1: Kundenrecherche (CLIENT_WEBSITE)

Lade mit curl (User-Agent Chrome, Accept-Language der Zielsprache) und werte mit dem Skript aus Abschnitt 9 aus:
- Startseite, robots.txt, sitemap.xml bzw. sitemap_index.xml und alle darin verlinkten Sitemaps (vollständige URL-Liste).
- Impressum, Über uns, Kontakt.
- Jede Sitemap-URL, deren Slug ein Wort des Keywords enthält (z. B. „ki“, „beratung“), und jede URL mit Orts- oder Regionsnamen im Slug (bestehendes Stadt- oder Regionalmuster).
- Zusätzlich je Seite eine narrative Zusammenfassung per WebFetch mit dieser Frage: Leistungen mit exakten Namen, Zielgruppen, Positionierung, Personen und Rollen, Proof-Elemente, Navigation, Standorte, CTA-Wortlaut, Formularfelder, Reaktionszusage, Preise, Förderhinweise, Datenschutz- und Regulierungsaussagen.

Halte fest:
1. **Kundenprofil:** Rechtsform, Anschrift, Telefon, E-Mail, Geschäftsführer oder Gründer, Leistungen (Navigation plus Schema OfferCatalog), Zielgruppen, Tagline, Reaktionszusage (z. B. „werktags in 24 Stunden“), Erstgesprächs-Format, Proof-Elemente.
2. **Stimme:** Sie oder Du, Tonlage, drei bis vier wörtliche Haltungssätze der Website.
3. **Hausmuster der Seiten:** Reihenfolge der Blöcke auf zwei bis drei Leistungsseiten (Hero mit Formular? Problem-Karten? Leistungen als H3? Ablauf in Schritten? Prinzipien? FAQ-Überschrift wörtlich? „Weitere Themen“? Abschluss-CTA?), Title- und Description-Muster, Eyebrow-Muster, URL-Muster (Hub und Unterseiten, Stadtseiten), Schema-Muster (Service, OfferCatalog, Person, PostalAddress, City, AdministrativeArea, FAQPage), Wortzahl der Hausseiten.
4. **Kannibalisierungs-Check:** Welche bestehende Seite zielt in Title, H1 oder URL bereits auf das Keyword oder auf Keyword ohne Ort? Wie oft nennen die thematisch nächsten Seiten den Ort? Entscheidung: neue Seite (mit URL nach dem Hausmuster) oder bestehende Seite ausbauen, mit Begründung.
5. **Was der Kunde gegenüber der SERP mitbringt und was ihm fehlt** (wird nach Phase 2 ergänzt): echte Adresse am Ort, sichtbare Personen, Themencluster, Methodentiefe, Schema; fehlend: Telefon, Logos, Stimmen, Praxisbeispiele, Preise, Förderhinweis.

## Phase 2: SERP-Recherche

### 2.1 Google-Autocomplete
Etwa 40 Seeds, mit dem Skript aus Abschnitt 9 (hl, gl aus Phase 0). Seeds bilden aus: Keyword; Keyword mit und ohne Bindestrich; Keyword mit Leerzeichen am Ende; Leistung plus Synonyme plus Ort (Berater, Agentur, Consulting, Experte, Firma, Dienstleister); Nachbarleistungen plus Ort (z. B. Workshop, Schulung, Seminar, Automatisierung, Strategie, Implementierung); Leistung ohne Ort plus Modifikatoren (für Unternehmen, Mittelstand, KMU, Kosten, kostenlos, Förderung, BAFA, Stundensatz); Alphabet-Sweep „Leistung a“ bis „Leistung w“ für die Leistung ohne Ort; Ort allein mit Leistungs-Kürzel; Ort plus Firma; Nachbarstädte und Region; ausgeschriebene Form der Leistung (z. B. „Künstliche Intelligenz Beratung“). Speichere `research/google-autocomplete.json`.

### 2.2 Suchergebnisse
- Mindestens vier Web-Suchen (Keyword exakt; Keyword mit Bindestrich plus Zielgruppe; Synonym-Variante wie „Agentur“; Personen-Variante wie „Berater“).
- Brave Search mit Länderparameter (`https://search.brave.com/search?q=<Keyword>&country=<gl>&source=web`) per WebFetch, alle organischen Treffer in Reihenfolge plus „Related searches“.
- Versuche Google mit hl/gl, Bing mit setmkt, DuckDuckGo lite, Ecosia. Erwarte Consent- oder Block-Seiten; notiere, was lief.
- **Konsens-Ranking:** Zähle je URL die Vorkommen über alle Quellen und gewichte mit der Brave-Position. Top 10 plus erweitertes Feld (11 bis 18). Institutionen und Verzeichnisse bleiben drin, sie sind SERP-Signale. Schreibe ins Deliverable, dass es ein Konsens ist.

### 2.3 Wettbewerberseiten lesen
Für alle Kandidaten (Top 10 plus erweitertes Feld, 18 bis 22 URLs):
- Roh-HTML per curl in `page_N.html`, Auswertung mit `serp_extract.py` (Title mit Zeichenzahl, Description mit Zeichenzahl, Canonical, Robots, H1, H2-Liste, H3-Zahl, JSON-LD-Typen, FAQPage-Fragen, Wortzahl, Keyword-Muster-Zähler). Keyword-Muster: Keyword mit Ort, Leistung allein, Synonyme (Agentur, Berater), Nachbarleistungen (Strategie, Workshop, Schulung, Automatisierung, Implementierung, Einführung), ausgeschriebene Form, Ort, Ortsadjektiv, Region, Zielgruppe (Mittelstand), Regulierung (DSGVO, AI Act o. ä.), Förderung (BAFA, Förder-), CTA-Signale (kostenlos, Erstgespräch, Erstberatung).
- Zusätzlich je Seite eine WebFetch-Extraktion mit 14 Punkten: Title, Description, H1, alle H2 und H3 in Reihenfolge, erster Absatz nach der H1 wörtlich (≤ 80 Wörter), Wortzahl, Keyword-Phrasen mit Häufigkeit, CTA-Wortlaut und Kontaktwege (Formular, Telefon, Kalender), FAQ-Fragen wörtlich, Preise wörtlich, Förderung, Branchen und Zielgruppen, Schema-Typen, lokale Bezüge (Stadtteile, Wahrzeichen, Branchen, Institutionen).
- Alle FAQPage-Fragen in `research/wettbewerber-faq-fragen.json`. Sie ersetzen „Ähnliche Fragen“, wenn Google nicht lesbar war.
- Statistik: Wortzahl-Reihe und Median, Ortsnennungen-Reihe und Median über die Anbieterseiten.

## Phase 3: Analyse

### 3.1 Intent-Scan
- **Der Begriff selbst:** Zerlege in Leistungsnomen, Ortsmodifier, fehlende Modifikatoren (Preis, Vergleich, Marke, Information). Leite Absicht und Kaufphase ab.
- **Je Top-10-Ergebnis:** Seitentyp (Anbieter, Verzeichnis, Institution, Ratgeber), Intention der Seite (kommerziell lokal, kommerziell überregional, kommerziell vergleichend, informationell, navigational), Signale (CTA, Telefon, Kalender, Preise, Standort, Sales-Text).
- **Ergebnis:** „X von 10 kommerziell“, Anteil im erweiterten Feld, was nicht rankt (Ratgeber, Blog, Shop).
- **Konsequenzen:** Seitentyp der neuen Seite; wie der informationelle Anteil auf derselben Seite bedient wird (Antwortblock, Faktenblock, FAQ); Erwartung an SERP-Features (Local Pack bei lokaler Dienstleistungssuche, „Ähnliche Fragen“) und was der Kunde dafür außerhalb der Seite braucht (Google-Unternehmensprofil); Kontaktwege, die die SERP vorgibt.

### 3.2 Fokus-Keyword je Wettbewerber
Tabelle: Wettbewerber, Title sagt, H1 sagt, URL sagt, Fokus-Keyword (fett), sekundäre Begriffe auf der Seite. Lesart: Keyword-Lager und welches Lager die Kundenseite bedient.

### 3.3 Keyword-Varianten
Cluster A Kern (bedienen), B Synonym-Lager (abfangen über FAQ), C Leistung plus Ort (Leistungsblock), D Kosten und Förderung (FAQ), E Branche am Ort (Anwendungsfälle), F Region (Nebenseiten), G Semantik und Information (Antwortblock), X Rauschen (nicht bedienen). Je Variante: Evidenz-Tags AC (Autocomplete), T×n (Title), H1×n, H2×n, FAQ×n, URL×n; Intention; Priorität (Fokus, Primär, Sekundär, Abfangen, Verlinken, Bedingt, Nebenseite, Nicht bedienen); Einsatz auf der Kundenseite mit Blocknummer. Als CSV mit Semikolon: `keyword;cluster;evidenz;intention;prioritaet;einsatz_auf_der_seite`.

### 3.4 SERP-Muster der Anbieterseiten
Tabelle „Muster | x von n | Konsequenz für die Kundenseite“ für: Title beginnt mit Keyword; H1 enthält Ort; H1 enthält Leistung; Orts-Absatz mit Branchen; FAQ sichtbar; FAQPage-Schema; CTA kostenloses Erstgespräch; Telefon sichtbar; Ablauf in Schritten; ProfessionalService oder LocalBusiness; Regulierung erwähnt; Förderung erwähnt; Vor-Ort-Frage in FAQ; Kalenderbuchung; Gründer sichtbar; Du-Ansprache; konkrete Preise; echte lokale Adresse. Dazu Wortzahl-Reihe mit Median, Ortsnennungen mit Median und daraus die Ziele für die Kundenseite (Wortzahl relativ zu SERP-Median und Hausstandard, Ortsnennungen am Median).

### 3.5 Angebots-Raster
Tabelle: Leistung, wie die Wettbewerber sie nennen | Anbieterseiten mit dieser Leistung (x von n) | Kundenleistung auf der neuen Seite | bestehende Kunden-Unterseite. Lesart: Was der Kunde abdeckt, was ihm fehlt, welche Felder in der SERP frei sind.

### 3.6 Verkaufsargumente
Sechs Argumente für den Suchenden, der gerade zehn Anbieter vergleicht, jedes mit der SERP-Zahl, die es stützt (z. B. „nur 2 von 13 haben eine Adresse am Ort“). Dazu eine Liste, was ohne Freigabe nicht als Argument verwendet wird.

## Phase 4: Blueprint schreiben

### 4.1 Zweck und Angebot (Abschnitt 1 des Deliverables)
Ziel (Anfragen von wem, wofür), primäre und sekundäre Conversion (aus den Formularen und Kontaktwegen des Kunden), Messgröße (Anfragen und Rückrufe pro Monat, Anteil Erstgespräche), Zielgruppe mit drei bis vier typischen Ausgangslagen, was die Seite nicht ist, Conversion-Pfad von der Suche bis zum ersten Angebot des Kunden.

### 4.2 URL, Title, Description, Open Graph, Breadcrumb, Eyebrow
Nach dem Hausmuster des Kunden, Grenzen aus Regel 5, Inhalte aus Regel 7. Title-Alternative angeben. Zeichenzahlen per Skript.

### 4.3 H1, Unterzeile oder Hero-CTAs, erster Absatz, Antwortblock
Regeln aus Regel 7. Hero-CTAs und Formularfelder exakt wie auf der Kundenwebsite. Reaktionszusage wörtlich vom Kunden. Antwortblock mit Verfasserzeile (Personen des Kunden, Person-Schema).

### 4.4 Seitenstruktur
10 bis 14 Blöcke in der Reihenfolge, die die Top 10 und das Hausmuster des Kunden gemeinsam vorgeben, typischerweise: Hero mit Angebot und Formular · Antwortblock · Nutzen · Problem · Leistungen (Karten mit Nutzen-Satz und Link auf Unterseiten) · Anwendungsfälle nach Branchen am Ort plus Arbeitsweise vor Ort · Vorgehen in Schritten · Warum der Kunde (die sechs Argumente) · Förderung und Regulierung · FAQ · Weitere Themen (interne Links) · Abschluss-CTA. Tabelle mit #, Block, H2 wörtlich, Inhalt und Aufgabe für die Kundengewinnung, Wortbudget; Summe im Zielkorridor. Neue Blöcke gegenüber dem Hausmuster markieren. Kein Block für Praxisbeispiele ohne freigegebene Fälle.

### 4.5 FAQ
Sieben bis acht Fragen, ausgewählt nach Häufigkeit der Themen in den geernteten Wettbewerber-FAQs (Zahl in Klammern), ergänzt um die FAQ-Themen des Kunden. Je Frage die Antwortrichtung in ein bis zwei Sätzen, faktisch zuerst, keine Zahl ohne Beleg. Eine Frage fängt das Synonym-Lager ab („Unterschied X und Y“).

### 4.6 Schema
Was das CMS des Kunden schon liefert (aus Phase 1) und was ergänzt wird: Service mit areaServed (City plus Region), OfferCatalog aus den Leistungskarten, Organization um ProfessionalService oder LocalBusiness ergänzen, wenn die Adresse sichtbar ist, Person für die Verfasser, FAQPage mit den sichtbaren Fragen, HowTo optional. Explizit verboten: AggregateRating ohne sichtbare Bewertungen, Adressen, die nicht auf der Seite stehen.

### 4.7 Keyword-Platzierungs-Checkliste
URL, H1, Title, Description, erster Absatz, H2-Anzahl mit Keyword, H3 ohne Keyword, Alt-Text, Zählziele für Keyword, Ort, Ortsadjektiv, Region, Zielgruppe, ausgeschriebene Form, Leistungsbegriffe je einmal, Adresse im Text, Wortzahl, FAQPage gleich sichtbarem Text, Formular mit Einwilligung.

### 4.8 Interne Verlinkung
Vom Hub, von der Startseite, von bestehenden Stadt- oder Regionalseiten auf die neue Seite; von der Seite auf jede Unterseite hinter den Leistungskarten; Sitemap-Seite; künftige Nebenseiten aus Cluster F.

### 4.9 Offene Entscheidungen
Nummerierte Liste, jede mit Empfehlung: URL-Konvention, Telefonnummer, Branchen und Anwendungsfälle zur Freigabe, Praxisbeispiele, Nutzen-Zahlen, Förder-Listung, Google-Unternehmensprofil, Schulungsangebot, Umfang, Suchvolumen nachziehen.

## Phase 5: Qualitätsprüfung vor Abgabe

Führe ein Python-Skript aus, das Title, Title-Alternative, Description, H1 (Zeichen) sowie Lead und Antwortblock (Wörter) misst, und trage exakt diese Zahlen ins Deliverable ein. Prüfe: keine erfundenen Fakten (Regel 1), Zeilenzahl der CSV stimmt mit der Angabe im Blueprint überein, Blocknummern in CSV und FAQ-Verweisen stimmen mit der Strukturtabelle überein, Summe der Wortbudgets liegt im Zielkorridor, jede Wettbewerber-Aussage hat eine „x von n“-Zahl aus Phase 2, Kannibalisierungs-Check ist beantwortet, Methodik-Grenzen stehen drin.

## Phase 6: Abgabe

1. Dateien im Ausgabeordner: `page-blueprint.md` (Struktur aus Abschnitt 6), `serp-analyse.md` (Struktur aus Abschnitt 7), `keyword-varianten.csv`, `research/google-autocomplete.json`, `research/wettbewerber-faq-fragen.json`.
2. Git: auf dem Branch committen (Commit-Titel „SEO: Page Blueprint und SERP-Analyse für „<Keyword>“ (Kunde <Domain>)“, Body mit Dateiliste), pushen mit `git push -u origin <branch>`, bei Netzfehlern bis zu vier Wiederholungen mit 2, 4, 8, 16 Sekunden Pause. Keinen Pull Request anlegen, wenn nicht verlangt.
3. HTML-Fassung veröffentlichen (Artifact), wenn ein Publisher verfügbar ist: Aufbau nach `docs/seo/templates/page-blueprint-artifact-template.html` (linke Inhaltsnavigation, Kopf mit vier Fakten-Kacheln Zweck, Angebot, Intention, Seitentyp, Abschnitte 0 bis 9 wie das Markdown, SERP-Snippet-Vorschau für Title und Description, Block-Stapel mit Nummer, Blockname, H2, Wortbudget, FAQ-Liste mit Häufigkeit, Checkliste, Entscheidungen; helles und dunkles Farbschema über Tokens; Titel der Seite „<Keyword> Blueprint“). Design-Tokens der Agentur verwenden, wenn ein Theme im Repo liegt.
4. Chat-Antwort: Ergebnis zuerst (Link, Branch, Ordner), dann die fünf wichtigsten Befunde (Intention mit „x von 10“, Keyword-Lager, Pflichtbausteine, Vorsprung des Kunden, Umfang), dann die Grenzen (Konsens-Ranking, kein Volumen, blockierte Quellen), dann die Entscheidungen, die der Kunde treffen muss. Keine Wiederholung des Dokuments.

## Abschnitt 6: Struktur von `page-blueprint.md` (verbindlich)

```
# Page Blueprint: <Keyword> für <Kunde> (<Domain>)
Kopfzeilen: Kunde (Rechtsform, Anschrift) · Zielseite (URL) · Fokus-Keyword · Zweck der Seite · Verfasser der Seite (Personen) · Stand und Grundlage

## 0. Kurzfassung
Zweck · Angebot · Fokus-Keyword (Schreibweise, Beleg) · Suchintention (x von 10) · Seitentyp · Vorsprung des Kunden · Kannibalisierung · Umfang

## 1. Zweck der Seite, Zielgruppe, Angebot
1.1 Wer der Kunde ist · 1.2 Was die Seite erreichen soll (Tabelle Ziel, primäre/sekundäre Conversion, Messgröße, Zielgruppe, was die Seite nicht ist) · 1.3 Was die Top 10 verkaufen und was der Kunde dafür hat (Angebots-Raster) · 1.4 Conversion-Pfad · 1.5 Bestehende Seiten und regionale Muster, was fehlt und nicht erfunden wird

## 2. SERP Top 10 und Intent-Scan
2.1 Der Suchbegriff selbst (Tabelle Bestandteil, Lesart, Folge) · 2.2 Intent-Scan der Top 10 (Tabelle Pos., Seite, Seitentyp, Intention, Signale; Ergebnis; Konsequenzen 1 bis 4) · 2.3 Die Top 10 im Überblick (Tabelle Pos., Seite, Fokus-Keyword, Wörter, Schema, Was die Seite prägt; erweitertes Feld als Absatz)

## 3. Methodik und Grenzen
Quellen · Grenzen (blockierte Quellen, Konsens statt Live, kein Volumen, nicht lesbare Seiten)

## 4. Fokus-Keywords der Wettbewerber
Tabelle Wettbewerber, Title sagt, H1 sagt, URL sagt, Fokus-Keyword, sekundäre Begriffe · Lesart (Keyword-Lager)

## 5. Keyword-Varianten aus der SERP-Analyse
Legende der Evidenz · Cluster A bis G je als Absatz mit Varianten und Evidenz · Nicht bedienen

## 6. SERP-Muster der Anbieterseiten
Tabelle Muster, Häufigkeit, Konsequenz · Wortzahl und Ortsnennungen mit Median und Zielen

## 7. Verkaufsargumente: Womit der Kunde sich von den Top 10 abhebt
Sechs nummerierte Argumente mit SERP-Zahl · was ohne Freigabe nicht verwendet wird

## 8. Blueprint
8.1 URL, Title, Meta Description, Open Graph (Tabelle Element, Wert, Länge; Begründung) · 8.2 H1, Unterzeile, erster Absatz (Zitatblock, Wortzahl, Hero-CTAs und Formular) · 8.3 Antwortblock (H2, Zitatblock, Wortzahl, Verfasserzeile) · 8.4 Seitenstruktur (Tabelle #, Block, H2, Inhalt und Aufgabe, Wörter; Summe) · 8.5 FAQ (nummeriert, Häufigkeit in Klammern, Antwortrichtung) · 8.6 Strukturierte Daten · 8.7 Keyword-Platzierung (Checkliste) · 8.8 Interne Verlinkung · 8.9 Offene Entscheidungen und Annahmen

## 9. Nächster Schritt
Nummerierte Liste: Entscheidungen klären, Copy schreiben, Seite anlegen, Links und Profil, Prüfung, Auswertung nach Livegang
```

## Abschnitt 7: Struktur von `serp-analyse.md`

Kopf mit Stand, Kunde, Zweck, Quellen, Grenzen, Legende der Keyword-Zählung. Dann je Top-10-Seite ein Block mit: Title (Zeichen), Description (Zeichen), H1, erster Absatz wörtlich, H2-Liste, Umfang und Zählung, FAQ wörtlich mit Schema-Hinweis, Schema-Typen, CTA und Kontaktwege, Preise, Förderung, Branchen, Fokus-Keyword und Sekundärbegriffe, Lesart in zwei Sätzen. Danach das erweiterte Feld kompakter, nicht lesbare Seiten benannt, zum Schluss ein Autocomplete-Auszug als Tabelle Seed, Vorschläge.

## Abschnitt 8: Referenz

Ein vollständiges Beispiel dieses Deliverables liegt unter `docs/seo/cex-koeln/ki-beratung-koeln/` (Keyword „KI-Beratung Köln“, Kunde cex.koeln). Übernimm Struktur, Tabellenköpfe, Tonfall und Detailtiefe exakt; ersetze alle Inhalte durch die Befunde der neuen Recherche.

## Abschnitt 9: Skripte

Roh-HTML laden (je URL, Reihenfolge wie `urls.txt`):
```bash
i=0; while read -r u; do i=$((i+1)); curl -sSL --max-time 40 \
  -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" \
  -H "Accept-Language: de-DE,de;q=0.9" -o "page_$i.html" "$u"; done < urls.txt
```

`serp_extract.py` (Aufruf: `python3 serp_extract.py urls.txt page_%d.html '<JSON: {"label": "regex", ...}>'`):
```python
#!/usr/bin/env python3
import sys, re, html, json
urls = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
pattern = sys.argv[2] if len(sys.argv) > 2 else "page_%d.html"
kw = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
def clean(x): return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", x))).strip()
allq = []
for i, u in enumerate(urls, 1):
    try: raw = open(pattern % i, encoding="utf-8", errors="ignore").read()
    except FileNotFoundError: print(f"=== [{i}] {u}: file missing"); continue
    def g(p):
        m = re.search(p, raw, re.I | re.S); return clean(m.group(1)) if m else "—"
    title = g(r"<title[^>]*>(.*?)</title>")
    desc = g(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']')
    if desc == "—": desc = g(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']')
    canon = g(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']')
    robots = g(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']')
    h1 = [clean(x) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", raw, re.I | re.S)]
    h2 = [clean(x) for x in re.findall(r"<h2[^>]*>(.*?)</h2>", raw, re.I | re.S)]
    h3n = len(re.findall(r"<h3[^>]*>", raw, re.I))
    types, qs = [], []
    for ld in re.findall(r"<script[^>]+application/ld\+json[^>]*>(.*?)</script>", raw, re.I | re.S):
        try: d = json.loads(ld.strip())
        except Exception: types.append("(unparsable)"); continue
        def walk(o):
            if isinstance(o, dict):
                t = o.get("@type")
                if t: types.append(t if isinstance(t, str) else str(t))
                if t == "Question" and o.get("name"): qs.append(clean(o["name"]))
                for v in o.values(): walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(d)
    body = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", "", raw, flags=re.I | re.S)
    text = clean(body); lt = text.lower()
    words = len(re.findall(r"[A-Za-zÄÖÜäöüß][\w\-']*", text))
    print(f"=== [{i}] {u}  ({len(raw)} bytes)")
    print(f"  TITLE: {title} ({len(title)} chars)\n  DESC : {desc} ({len(desc)} chars)\n  CANON: {canon}\n  ROBOTS: {robots}")
    print(f"  H1 ({len(h1)}): {h1}\n  H2 ({len(h2)}): {h2}\n  H3 count: {h3n} | ~words: {words}")
    print(f"  JSON-LD types: {sorted(set(types)) or '—'}")
    if qs: print(f"  FAQ ({len(qs)}): {qs}")
    if kw: print("  KW counts: " + ", ".join(f"{k}={len(re.findall(p, lt))}" for k, p in kw.items()))
    allq += [(u, q) for q in qs]
json.dump(allq, open("faq_questions.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("TOTAL FAQ questions harvested:", len(allq))
```

Beispiel für die Keyword-Muster (Keyword „KI Beratung Köln“):
```json
{"kw+ort": "ki[\\s\\-‑–]?beratung (?:in |für )?köln", "kw": "ki[\\s\\-‑–]beratung", "berater": "ki[\\s\\-‑–]berater", "agentur+ort": "ki[\\s\\-‑–]agentur (?:in |für )?köln", "agentur": "ki[\\s\\-‑–]agentur", "strategie": "ki[\\s\\-‑–]strategie", "workshop": "ki[\\s\\-‑–]workshop", "schulung": "ki[\\s\\-‑–]schulung", "automatisierung": "ki[\\s\\-‑–]automatisierung", "implementierung": "ki[\\s\\-‑–]implementierung", "ausgeschrieben": "künstliche intelligenz", "ort": "köln", "ortsadj": "kölner", "region": "rheinland|\\bnrw\\b|nordrhein", "mittelstand": "mittelstand", "dsgvo": "dsgvo", "ai-act": "ai act|ki-verordnung", "bafa": "\\bbafa\\b", "foerder": "förder", "kostenlos": "kostenlos", "erstgespraech": "erstgespräch|erstberatung|ersteinschätzung"}
```

`autocomplete.py` (Aufruf: `python3 autocomplete.py de DE seeds.txt`):
```python
#!/usr/bin/env python3
import sys, json, subprocess, urllib.parse, time
hl, gl = sys.argv[1], sys.argv[2]
seeds = [l.rstrip("\n") for l in open(sys.argv[3], encoding="utf-8") if l.strip()]
out = {}
for s in seeds:
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&hl={hl}&gl={gl}&q={urllib.parse.quote(s)}"
    try:
        r = subprocess.run(["curl", "-sS", "--max-time", "20", "-A", "Mozilla/5.0",
                            "-H", f"Accept-Language: {hl}-{gl},{hl};q=0.9", url],
                           capture_output=True, text=True, timeout=30)
        out[s] = json.loads(r.stdout)[1]
    except Exception as e:
        out[s] = f"ERR {e}"
    print(f"{s!r:45} -> {out[s]}")
    time.sleep(0.4)
json.dump(out, open("autocomplete.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
```

Längenprüfung vor Abgabe:
```python
t, t2, d, h1, lead, ab = "<Title>", "<Title-Alternative>", "<Description>", "<H1>", "<Lead>", "<Antwortblock>"
print("title", len(t), "| alt", len(t2), "| desc", len(d), "| h1", len(h1), "| lead words", len(lead.split()), "| answer words", len(ab.split()))
```

END PROMPT
