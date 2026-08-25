# Nicht ausgelieferte Medien

Diese Dateien lagen in `public/` und wurden dadurch bei **jedem** Build nach
`dist/` und weiter in den Veröffentlichungszweig kopiert — auch nachdem sie
niemand mehr geladen hat.

| Datei | Größe | War verbaut in | Warum hier |
|---|---|---|---|
| `video/seo-logo.mp4`, `video/google-ads-logo.mp4`, `video/socials-logo.mp4`, `video/website-logo.mp4` | 26,4 MB | `ServicesCarousel.tsx` (Vollbild-Video hinter jeder Service-Karte) | Der Abschnitt ist am 24.08.2026 ein Raster geworden. Vier Endlosvideos gleichzeitig sind Unruhe und 26 MB Ladelast; die Kacheln sind jetzt Vektor-Symbole. |
| `snapshot/slide-01.jpg`, `slide-02.jpg`, `slide-03.jpg` | 608 kB | `AgencySnapshot.tsx` (Hintergrundbild je Karussell-Folie) | Hochhäuser, ein Mann am Schreibtisch, eine Teambesprechung — keines der drei Bilder zeigte, was daneben stand. Bild ohne Aussage erhöht die Last. |

Nichts davon ist gelöscht: die Dateien liegen hier und stehen vollständig in
der Git-Historie. Wer sie zurückholt, muss sie nach `public/` zurückschieben
**und** wieder verbauen — ein Pfad allein reicht nicht.

Stand: 24.08.2026.
