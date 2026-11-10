# Measuring points

Coordinates are OpenStreetMap centroids (Nominatim, 11/2026). Use the district, not the city, when the client's catchment area is a district.

| Key | Label | Lat | Lng | Footer must name | SerpApi `location` |
|---|---|---|---|---|---|
| `frintrop` | Essen-Frintrop | 51.4776 | 6.9083 | Frintrop or Essen | not trusted for Essen |
| `essen-mitte` | Essen-Mitte (Stadtkern) | 51.4569 | 7.0115 | Essen | not trusted for Essen |
| `oberhausen` | Oberhausen | 51.4696 | 6.8514 | Oberhausen | `Oberhausen,North Rhine-Westphalia,Germany` |
| `muelheim` | Mülheim an der Ruhr | 51.4273 | 6.8829 | Mülheim | not yet passed, check first |
| `bottrop` | Bottrop | 51.5216 | 6.9292 | Bottrop | `Bottrop,North Rhine-Westphalia,Germany` |
| `gelsenkirchen` | Gelsenkirchen | 51.5110 | 7.0960 | Gelsenkirchen | not yet passed, check first |

SerpApi `location` strings must match SerpApi's canonical names. Look them up with `https://serpapi.com/locations.json?q={city}&limit=5` and copy `canonical_name`.

## Adding a point

1. Look up the centroid: `https://nominatim.openstreetmap.org/search?q={Stadtteil},{Stadt},Deutschland&format=json&limit=1` (send a User-Agent, max 1 request per second).
2. Round to 4 decimals (~10 m).
3. Add a row here and the same key to `POINTS` in `scripts/serp_reading.mjs`.
4. Before trusting SerpApi for the new point, compare one SerpApi reading with one verified browser reading.

## Zoom for Serper `/maps`

`ll=@{lat},{lng},{zoom}z`. Use `14z` for a district, `12z` for a whole city.
