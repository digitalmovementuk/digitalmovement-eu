import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { hero } from "../content";
import { submitLead, trackLead } from "../lib/submitLead";
import { CONSENT_TEXT } from "../lib/consentText";
import "../styles/hero-success.css";

/**
 * Hero — Video-Karussell mit dem Text aus dem freigegebenen Dokument.
 *
 * Aufbau nach Abschnitt 2 des Dokuments, in genau dieser Reihenfolge:
 * Überzeile → Überschrift (zwei Zeilen) → Fließtext → Formular →
 * „Kostenloses Erstgespräch · Antwort innerhalb 2 Stunden" →
 * Leistungs-Schlagworte → Google-Bewertungs-Badge.
 *
 * Was hier NICHT mehr steht und warum (2026-08-15, Anweisung Raoul
 * „dramatisch aufräumen"):
 *
 *  - Das Award-Banner der englischen Vorlage. Die Auszeichnung ist
 *    australisch, steht in keinem Feld des deutschen Dokuments, und auf dem
 *    Telefon lag sie über dem ersten Wort jeder Zeile.
 *  - Der Kontakt-Slider am unteren Rand. Auch er kommt aus der Vorlage; das
 *    Dokument nennt für den Startbereich keine Kontaktdaten. Er kostete
 *    150–210 px Fußraum und zog den Blick von der einen Handlung weg, um die
 *    es hier geht. Telefon, WhatsApp, E-Mail und Anschrift stehen weiterhin
 *    im Kontaktabschnitt und in der Fußzeile.
 *
 * Übrig bleiben sieben Zeilen statt zehn, eine Bewegung statt vier, und ein
 * Bildschirm, den man in einem Blick liest.
 *
 * Zwei Dinge, die absichtlich so sind:
 *  1. Das Formular fragt die Telefonnummer ab, nicht die E-Mail. Telefon ist
 *     Pflicht, E-Mail optional — das gilt für jedes Formular auf jeder
 *     Digital-Movement-Seite.
 *  2. Ohne gesetztes Häkchen geht gar nichts raus: submitLead verweigert die
 *     Übertragung, bevor irgendein Netzwerkaufruf passiert.
 */

type Slide = {
  key: string;
  /** Desktop-Datei. Poster wird für den ersten Frame gebraucht. */
  src: string;
  srcMobile: string;
  poster: string;
};

/* Drei Videos zu den drei Textblöcken aus dem Dokument. Berlin steht vorn,
   weil die Seite für den deutschen Markt ist; die beiden anderen sind
   Stadtaufnahmen ohne erkennbaren Ort. Wechsel und Text laufen im selben
   Takt — ein Bild, ein Text, sonst liest man Zeile 2 zu Bild 3. */
const SLIDES: Slide[] = [
  {
    key: "berlin",
    src: "/video/hero/berlin.mp4",
    srcMobile: "/video/hero/berlin-mobile.mp4",
    poster: "/video/hero/berlin-poster.jpg",
  },
  {
    key: "cunos",
    src: "/video/hero/cunos-hero.mp4",
    srcMobile: "/video/hero/cunos-hero-mobile.mp4",
    poster: "/video/hero/cunos-hero-poster.jpg",
  },
  {
    key: "melbourne",
    src: "/video/hero/melbourne.mp4",
    srcMobile: "/video/hero/melbourne-mobile.mp4",
    poster: "/video/hero/melbourne-poster.jpg",
  },
];

/* 8 Sekunden — so steht es im Dokument. */
const SLIDE_MS = 8000;

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Formularzustand
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honey, setHoney] = useState("");

  // Einblenden erst nach dem Mount: server-gerendertes HTML soll den
  // Ruhezustand zeigen, nicht den Zwischenstand einer Animation.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Video-Karussell
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Nur der sichtbare Clip läuft. Alles andere ist verschenkte Akkulaufzeit —
  // und auf iOS scheitert play() ohnehin, solange das Element unsichtbar ist.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === slide) {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [slide]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (honey) return; // Honeypot getroffen — kommentarlos verwerfen
      if (!consent || !phone.trim() || sending) return;

      setSending(true);
      setError(null);

      const result = await submitLead({
        name: "",
        phone: phone.trim(),
        service: hero.formService,
        message: hero.formMessage,
        consent,
        source: "home-hero",
      });

      setSending(false);

      if (result.ok) {
        trackLead("home-hero");
        setSent(true);
      } else {
        setError(hero.formError);
      }
    },
    [consent, honey, phone, sending],
  );

  /* Text und Video teilen sich denselben Index. Steht kein Textblock zur
     Verfügung, fällt der Hero auf den ersten zurück statt leer zu bleiben. */
  const copy = hero.slides[slide] ?? hero.slides[0];

  return (
    <header id="top" className={`dm-hero${mounted ? " is-in" : ""}`} data-surface="dark">
      {/* ---------- Video-Hintergrund ---------- */}
      <div className={`dm-hero__bg${mounted ? " is-in" : ""}`} aria-hidden>
        <div className="dm-hero__slides">
          {SLIDES.map((s, i) => (
            <div key={s.key} className={`dm-hero__slide${i === slide ? " is-active" : ""}`}>
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="dm-hero__video"
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "none"}
                poster={s.poster}
              >
                <source src={s.srcMobile} media="(max-width:760px)" />
                <source src={s.src} />
              </video>
            </div>
          ))}
        </div>
        <div className="dm-hero__scrim" />
      </div>

      {/* ---------- Inhalt ---------- */}
      <div className="dm-hero__wrap">
        {/* key = Slide-Schlüssel: React baut den Textblock neu auf, damit die
            Einblendung bei jedem Wechsel erneut läuft. Der Schlüssel sitzt am
            gemeinsamen Elternteil, nicht an drei einzelnen Knoten — so
            wechseln Überzeile, Überschrift und Fließtext garantiert im selben
            Takt und können nicht in unterschiedlichen Zuständen hängen
            bleiben. */}
        <div className="dm-hero__copy" key={copy.key}>
          <p className="dm-hero__eyebrow">{copy.eyebrow}</p>

          <h1 className="dm-hero__h1">
            <span className="dm-hero__line">
              {copy.headlinePre}
              <em className="dm-hero__em">{copy.headlineEm}</em>
              {copy.headlinePost}
            </span>
            {copy.headlineBottom ? (
              <span className="dm-hero__line dm-hero__line--sub">{copy.headlineBottom}</span>
            ) : null}
          </h1>

          <p className="dm-hero__sub">{copy.sub}</p>
        </div>

        <div className="dm-hero__actions">
          {sent ? (
            <p className="dm-hero__ok" role="status">
              {hero.formSuccess}
            </p>
          ) : (
            <>
              <form className="dm-hero__form" onSubmit={onSubmit}>
                <label className="sr-only" htmlFor="hero-phone">
                  {hero.formLabel}
                </label>
                <input
                  id="hero-phone"
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={hero.formPlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {/* Honeypot. Nicht "website" nennen — der gemeinsame Endpunkt
                    liest dieses Feld als echte URL des Anfragenden. */}
                <span className="dm-hero__honey" aria-hidden>
                  <label htmlFor="hero-honey">Dieses Feld bitte leer lassen</label>
                  <input
                    id="hero-honey"
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                  />
                </span>
                <button type="submit" disabled={sending}>
                  {sending ? hero.formSending : hero.formCta}
                  {!sending && (
                    <span className="dm-hero__arr" aria-hidden>
                      →
                    </span>
                  )}
                </button>
              </form>

              <label className="dm-hero__consent">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  {CONSENT_TEXT} <Link to="/datenschutz">Datenschutzerklärung</Link>
                </span>
              </label>

              {error ? (
                <p className="dm-hero__err" role="alert">
                  {error}
                </p>
              ) : null}

              <span className="dm-hero__note">{hero.formNote}</span>
            </>
          )}
        </div>

        {/* Leistungs-Schlagworte und Google-Badge stehen zusammen in einer
            ruhigen Fußzeile des Startbereichs, statt als zwei weitere
            Textblöcke untereinander. */}
        <div className="dm-hero__foot">
          <p className="dm-hero__services">
            {hero.services.map((s, i) => (
              <span key={s}>
                {i > 0 && <i aria-hidden>·</i>}
                {s}
              </span>
            ))}
          </p>

          <a
            className="dm-hero__google"
            href={hero.reviewsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoogleGlyph />
            <span className="dm-hero__stars" aria-hidden>
              ★★★★★
            </span>
            <span>{hero.reviewsLabel}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function GoogleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
