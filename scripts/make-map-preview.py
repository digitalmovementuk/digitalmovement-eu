#!/usr/bin/env python3
"""
Erzeugt das Vorschaubild der Karte in der Fußzeile.

Warum ein eigenes Bild und kein Google-Standbild: Solange die Besucherin
nicht geklickt hat, darf keine Verbindung zu Google entstehen — sonst wäre
die Karte eine Datenübermittlung ohne Einwilligung (§ 25 TDDDG). Das
Vorschaubild liegt deshalb auf unserem eigenen Server. Es stammt aus
OpenStreetMap-Kacheln (ODbL), die Namensnennung steht sichtbar im Bauteil
FooterMap.tsx — ohne sie wäre die Lizenz verletzt.

Einmalig ausgeführt; das Ergebnis liegt im Repository. Erneut laufen lassen
nur, wenn sich die Anschrift ändert.

    python3 scripts/make-map-preview.py
"""
import io
import math
import urllib.request

from PIL import Image

LAT, LON = 52.4862836, 13.3599205          # Kolonnenstraße 8, 10827 Berlin
ZOOM = 17
OUT_W, OUT_H = 1600, 600
OUT = "public/brand/karte-kolonnenstrasse-8.jpg"
UA = "DigitalMovement-site-build/1.0 (hallo@digitalmovement.eu)"
TILE = 256


def project(lat, lon, z):
    """Weltpixel-Koordinaten (Web-Mercator) für einen Punkt."""
    n = TILE * 2 ** z
    x = (lon + 180.0) / 360.0 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


def main():
    cx, cy = project(LAT, LON, ZOOM)
    left, top = cx - OUT_W / 2, cy - OUT_H / 2
    tx0, ty0 = int(left // TILE), int(top // TILE)
    tx1, ty1 = int((left + OUT_W) // TILE), int((top + OUT_H) // TILE)

    canvas = Image.new("RGB", ((tx1 - tx0 + 1) * TILE, (ty1 - ty0 + 1) * TILE), "#f2efe9")
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            url = f"https://tile.openstreetmap.org/{ZOOM}/{tx}/{ty}.png"
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                tile = Image.open(io.BytesIO(r.read())).convert("RGB")
            canvas.paste(tile, ((tx - tx0) * TILE, (ty - ty0) * TILE))
            print(f"  Kachel {tx}/{ty}")

    ox, oy = int(left - tx0 * TILE), int(top - ty0 * TILE)
    crop = canvas.crop((ox, oy, ox + OUT_W, oy + OUT_H))
    crop.save(OUT, "JPEG", quality=78, optimize=True, progressive=True)
    print(f"geschrieben: {OUT}")


if __name__ == "__main__":
    main()
