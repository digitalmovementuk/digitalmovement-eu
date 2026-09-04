import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { business, navLinks } from "../content";

const BASE = import.meta.env.BASE_URL;

/* Die eine feste Ebene der Seite: 72 px hoch, weiß, ein Strich darunter.
   Kein Glas, kein Logo-Wechsel, keine Animation. Auf dem Telefon klappt
   ein einfaches Feld auf. Seit dem Design-Audit vom 04.09.2026. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/" || pathname === "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = navLinks.map((l) => ({
    label: l.label,
    href: onHome ? l.href : `/${l.href}`,
  }));

  return (
    <div className="sticky top-0 z-50 border-b border-line bg-white">
      <nav className="container-v3 flex h-[72px] items-center justify-between gap-6" aria-label="Hauptnavigation">
        <Link to="/" className="flex items-center" aria-label={`${business.name} — Startseite`}>
          <img
            src={`${BASE}brand/logo-color-positive.svg`}
            alt={business.name}
            width={168}
            height={36}
            className="h-8 w-auto md:h-9"
            decoding="async"
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="text-[16px] font-semibold text-ink-soft hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a href={onHome ? "#contact" : "/#contact"} className="btn btn-primary btn-inline min-h-[46px] px-5 text-[16px]">
            Erstgespräch
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </nav>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-white md:hidden">
        <ul className="container-v3 flex flex-col py-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-[18px] font-semibold"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="py-4">
            <a href={onHome ? "#contact" : "/#contact"} onClick={() => setOpen(false)} className="btn btn-primary">
              Erstgespräch
            </a>
          </li>
          <li className="pb-4">
            <a href={business.phoneHref} className="btn btn-secondary">
              {business.phone}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
