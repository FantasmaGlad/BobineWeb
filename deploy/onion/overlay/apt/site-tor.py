#!/usr/bin/env python3
"""Variante Tor des pages du portail packages.bobine.fit : le bloc d'installation passe par le service onion.

Les pages publiées délimitent leurs commandes (clé, dépôts APT, DNF et Pacman, toutes en https://packages.bobine.fit)
par <!-- install --> et <!-- /install -->. Copiées depuis le miroir, elles contacteraient le web classique : le bloc
devient la procédure Tor (télécharger install-tor.sh par le proxy SOCKS, le lire, l'exécuter).

Échoue (code 1) si une page d'accueil n'a plus ses marqueurs : le miroir garde alors sa copie précédente (sync.sh),
plutôt que de publier un portail aux commandes clearnet.

Usage : site-tor.py <dossier de release APT>
"""
import html
import re
import sys
from pathlib import Path

SITE_HOST = "bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion"
PAGES = ("index.html", "fr/index.html")
BLOCK = re.compile(r"<!-- install -->.*?<!-- /install -->", re.S)

TEXT = {
    "en": ("Install over Tor", "The script installs Tor, configures the signed repository (APT, DNF or Pacman) and checks the key fingerprint. Read it before running it; add --channel=beta or --channel=canary to follow another channel."),
    "fr": ("Installer par Tor", "Le script installe Tor, configure le dépôt signé (APT, DNF ou Pacman) et vérifie l'empreinte de la clé. Lisez-le avant de l'exécuter ; ajoutez --channel=beta ou --channel=canary pour suivre un autre canal."),
}
COMMANDS = (
    f"curl --fail --socks5-hostname 127.0.0.1:9050 http://{SITE_HOST}/install-tor.sh -o install-tor.sh\n"
    "less install-tor.sh\n"
    "bash install-tor.sh"
)


def block(lang: str) -> str:
    title, text = TEXT[lang]
    return (f"<!-- install -->\n<h2>{html.escape(title)}</h2>\n<p>{html.escape(text)}</p>\n"
            f"<pre><code>{html.escape(COMMANDS)}</code></pre>\n<!-- /install -->")


def patch(text: str, lang: str) -> str:
    """Renvoie la page adaptée ; lève ValueError si le bloc d'installation a disparu."""
    if not BLOCK.search(text):
        raise ValueError("marqueurs <!-- install --> absents")
    return BLOCK.sub(lambda _m: block(lang), text, count=1)


def main() -> int:
    root = Path(sys.argv[1])
    try:
        for name in PAGES:
            page = root / name
            page.write_text(patch(page.read_text(encoding="utf-8"), "fr" if name.startswith("fr/") else "en"), encoding="utf-8")
    except (OSError, ValueError) as exc:
        print(f"[site-tor] adaptation impossible : {exc}", file=sys.stderr)
        return 1
    print("[site-tor] bloc d'installation du portail passé au service onion")
    return 0


if __name__ == "__main__":
    sys.exit(main())
