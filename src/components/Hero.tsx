import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { hero } from "../content";
import { submitLead, trackLead } from "../lib/submitLead";
import { CONSENT_TEXT } from "../lib/consentText";
import "../styles/hero-success.css";

/**
 * Hero — 1:1 portiert von success.digitalmovement.uk.
 *
 * Aufbau wie in der Vorlage: Video-Karussell im Hintergrund, Award-Banner
 * oben links, mittig Eyebrow → H1 → Google-Zeile → Untertitel → Anfrage-
 * formular → Leistungsband, unten der durchlaufende Slider.
 *
 * Zwei Dinge sind bewusst anders als in der englischen Vorlage:
 *
 *  1. Die Vorlage blendet Eyebrow, Formular und Leistungsband über dem Video
 *     aus. Hier bleiben sie sichtbar — die freigegebene Copy hat für jedes
 *     dieser Elemente einen Text, und ein Formular im ersten Bildschirm ist
 *     Hausstandard.
 *  2. Das Formular fragt die Telefonnummer ab, nicht die E-Mail. Telefon ist
 *     Pflicht, E-Mail optional — das gilt für jedes Formular auf jeder
 *     Digital-Movement-Seite. Ohne gesetztes Häkchen geht gar nichts raus:
 *     submitLead verweigert die Übertragung, bevor irgendein Netzwerkaufruf
 *     passiert.
 *
 * Der Slider unten trägt in der Vorlage vier Büros. Ein deutsches
 * Einzelunternehmen hat keine vier Büros, also stehen dort die echten
 * Kontaktwege — gleiche Mechanik, überprüfbarer Inhalt.
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
const LOC_MS = 4200;

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [loc, setLoc] = useState(0);
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

  // Kontakt-Slider
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setLoc((i) => (i + 1) % hero.contacts.length), LOC_MS);
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
    <header
      id="top"
      className={`dm-hero${mounted ? " is-in" : ""}`}
      data-surface="dark"
    >
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

      {/* ---------- Award-Banner ---------- */}
      <AwardRibbon shown={mounted} />

      {/* ---------- Inhalt ---------- */}
      <div className="dm-hero__wrap">
        {/* key = Slide-Index: React baut die Knoten neu auf, und damit läuft
            die Einblend-Animation bei jedem Wechsel erneut. Ohne den key
            stünde der neue Text ohne Bewegung da. */}
        <p className="dm-hero__eyebrow" key={`eb-${copy.key}`}>
          <span className="dm-hero__rule" aria-hidden />
          {copy.eyebrow}
        </p>

        <h1 className="dm-hero__h1" key={`h1-${copy.key}`}>
          <span className="dm-hero__line">
            <span>
              {copy.headlinePre}
              <em className="dm-hero__em">{copy.headlineEm}</em>
              {copy.headlinePost}
            </span>
          </span>
          {copy.headlineBottom ? (
            <span className="dm-hero__line dm-hero__line--sub">
              <span>{copy.headlineBottom}</span>
            </span>
          ) : null}
        </h1>

        <div className="dm-hero__trust">
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

        <div className="dm-hero__quote" key={`sub-${copy.key}`}>
          <p>{copy.sub}</p>
        </div>

        <div className="dm-hero__actions">
          {sent ? (
            <p className="dm-hero__ok" role="status">
              {hero.formSuccess}
            </p>
          ) : (
            <>
              <form className="dm-hero__form" onSubmit={onSubmit} noValidate={false}>
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
                  {CONSENT_TEXT}{" "}
                  <Link to="/datenschutz">Datenschutzerklärung</Link>
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

        <p className="dm-hero__services">
          {hero.services.map((s, i) => (
            <span key={s}>
              {i > 0 && <i aria-hidden>· </i>}
              {s}
            </span>
          ))}
        </p>
      </div>

      {/* ---------- Kontakt-Slider ---------- */}
      <div className={`dm-hero__locslider${mounted ? " is-in" : ""}`}>
        <div className="dm-hero__loctrack">
          {hero.contacts.map((c, i) => (
            <div
              key={c.label}
              className={`dm-hero__locitem${i === loc ? " is-active" : ""}`}
              aria-hidden={i !== loc}
            >
              <span className="dm-hero__locname">{c.label}</span>
              {c.href ? (
                <a
                  className="dm-hero__locvalue"
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  tabIndex={i === loc ? 0 : -1}
                >
                  {c.value}
                </a>
              ) : (
                <span className="dm-hero__locvalue">{c.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="dm-hero__locdots">
          {hero.contacts.map((c, i) => (
            <button
              key={c.label}
              type="button"
              className={i === loc ? "is-active" : undefined}
              aria-label={c.label}
              aria-current={i === loc}
              onClick={() => setLoc(i)}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

/**
 * Der Award-Streifen. Die Auszeichnung ist echt und wurde in Australien
 * vergeben — deshalb steht sie hier im englischen Originalwortlaut. Eine
 * übersetzte Auszeichnung wäre eine erfundene Auszeichnung.
 */
function AwardRibbon({ shown }: { shown: boolean }) {
  const [glassy, setGlassy] = useState(false);

  useEffect(() => {
    if (!shown) return;
    const id = window.setTimeout(() => setGlassy(true), 1700);
    return () => window.clearTimeout(id);
  }, [shown]);

  return (
    <div
      className={`dm-hero__ribbon${shown ? " is-in" : ""}${glassy ? " is-glassy" : ""}`}
      role="img"
      aria-label="Digital Reference Award Winner — Best Digital Marketing Agency in Australia, 2026"
    >
      <svg className="dm-hero__ribbon-medal" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 6.2l1.1 2.2 2.4.35-1.75 1.7.42 2.4L12 11.72 9.83 12.87l.42-2.4L8.5 8.77l2.4-.35L12 6.2z" fill="currentColor" />
        <path d="M8.6 14.4L6.6 21l5.4-2.6 5.4 2.6-2-6.6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="dm-hero__ribbon-brand">Digital Reference</span>
      <span className="dm-hero__ribbon-rule" aria-hidden />
      <span className="dm-hero__ribbon-tag">Award Winner</span>
      <span className="dm-hero__ribbon-title">Best Digital Marketing Agency in Australia</span>
      <span className="dm-hero__ribbon-stars" aria-hidden>
        ★★★★★
      </span>
      <span className="dm-hero__ribbon-year">2026</span>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden>
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
