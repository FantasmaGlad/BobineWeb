#!/usr/bin/env python3
"""Variante Tor de apt.bobine.fit : le mot-symbole en pixels de l'en-tête devient le logo officiel complet de Bobine.

Le logo est un fichier image copié à la racine de la copie servie (le miroir n'accepte aucune ressource externe).
Si le logo amont a changé de forme, la page est laissée intacte.

Usage : apt-tor.py <dossier de release APT>
"""
import re
import shutil
import sys
from pathlib import Path

release = Path(sys.argv[1])
LOGO_FILE = "logo_bobine_entier.png"

LOGO = re.compile(r'<svg viewBox="24 20 944 280" class="site-brand__logo"[^>]*>.*?</svg>', re.S)
NEW = f'<img src="/{LOGO_FILE}" class="site-brand__logo" alt="Bobine" width="261" height="96" decoding="async">'
CSS = "\n    .site-brand__logo { height: 2rem; width: auto; display: block; }\n  "

patched = 0
for page in release.rglob("*.html"):
    html = page.read_text(encoding="utf-8")
    if f'src="/{LOGO_FILE}"' in html or not LOGO.search(html) or "</style>" not in html:
        continue
    html = LOGO.sub(lambda _m: NEW, html, count=1)
    html = html.replace("</style>", CSS + "</style>", 1)
    page.write_text(html, encoding="utf-8")
    patched += 1

if patched:
    shutil.copyfile(Path(__file__).with_name(LOGO_FILE), release / LOGO_FILE)

print(f"[apt-tor] logo officiel dans {patched} page(s)")
