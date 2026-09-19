#!/usr/bin/env python3
"""Variante Tor de apt.bobine.fit : le logo ASCII de l'en-tete devient « Baamix dans l'oignon » (ASCII art).

Le dessin est un SVG (memes chemins que le site, voir scripts/tor-art/generate.py) : il garde ses
proportions sur tous les appareils. Si le logo amont a change de forme, la page est laissee intacte.

Usage : apt-tor.py <dossier de release APT>
"""
import json
import re
import sys
from pathlib import Path

release = Path(sys.argv[1])
art = json.loads((Path(__file__).with_name("tor-art.json")).read_text(encoding="utf-8"))

LOGO = re.compile(r'<svg viewBox="24 20 944 280" class="site-brand__logo"[^>]*>.*?</svg>', re.S)
NEW = (
    f'<svg viewBox="{art["viewBox"]}" class="site-brand__logo site-brand__logo--tor" role="img" '
    'aria-label="Bobine, Baamix dans l\'oignon Tor" preserveAspectRatio="xMidYMid meet">'
    f'<g transform="scale(1,2)"><path fill="#7d4698" d="{art["purple"]}"/>'
    f'<path fill="#68b030" d="{art["green"]}"/></g></svg>'
)
CSS = "\n    .site-brand__logo--tor { height: 40px; width: auto; }\n  "

patched = 0
for page in release.rglob("*.html"):
    html = page.read_text(encoding="utf-8")
    if "site-brand__logo--tor" in html or not LOGO.search(html) or "</style>" not in html:
        continue
    html = LOGO.sub(lambda _m: NEW, html, count=1)
    html = html.replace("</style>", CSS + "</style>", 1)
    page.write_text(html, encoding="utf-8")
    patched += 1

print(f"[apt-tor] logo remplace dans {patched} page(s)")
