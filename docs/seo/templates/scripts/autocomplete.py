#!/usr/bin/env python3
"""Google Autocomplete sweep. Usage: python3 autocomplete.py de DE seeds.txt
Writes autocomplete.json {seed: [suggestions]} and prints each line."""
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
