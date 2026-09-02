#!/usr/bin/env python3
"""Extract on-page SEO facts from saved raw HTML files.

Usage: python3 serp_extract.py urls.txt page_%d.html "kw regex patterns json"
Reads urls.txt (one URL per line, page_N.html saved with curl in the same order)
and prints title, description, canonical, robots, H1, H2/H3 counts, JSON-LD types,
FAQPage questions, word count and keyword-pattern counts per page. Writes
faq_questions.json with every FAQPage question harvested.
"""
import sys, re, html, json

urls = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
pattern = sys.argv[2] if len(sys.argv) > 2 else "page_%d.html"
kw = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}

def clean(x):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", x))).strip()

allq = []
for i, u in enumerate(urls, 1):
    try:
        raw = open(pattern % i, encoding="utf-8", errors="ignore").read()
    except FileNotFoundError:
        print(f"=== [{i}] {u}: file missing"); continue
    def g(p):
        m = re.search(p, raw, re.I | re.S); return clean(m.group(1)) if m else "—"
    title = g(r"<title[^>]*>(.*?)</title>")
    desc = g(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']')
    if desc == "—":
        desc = g(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']')
    canon = g(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']')
    robots = g(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']')
    h1 = [clean(x) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", raw, re.I | re.S)]
    h2 = [clean(x) for x in re.findall(r"<h2[^>]*>(.*?)</h2>", raw, re.I | re.S)]
    h3n = len(re.findall(r"<h3[^>]*>", raw, re.I))
    types, qs = [], []
    for ld in re.findall(r"<script[^>]+application/ld\+json[^>]*>(.*?)</script>", raw, re.I | re.S):
        try:
            d = json.loads(ld.strip())
        except Exception:
            types.append("(unparsable)"); continue
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
