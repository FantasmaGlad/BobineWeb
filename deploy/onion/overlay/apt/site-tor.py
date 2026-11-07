#!/usr/bin/env python3
"""Variante Tor de assets/site.js (portail packages.bobine.fit) : commandes et liens passent par le service onion.

Le configurateur du portail construit ses commandes (clé, dépôts APT, DNF et Pacman) avec https://packages.bobine.fit et
ses téléchargements directs avec github.com : copiées ou cliquées depuis le miroir, elles contacteraient le web
classique et exposeraient l'adresse IP du visiteur. Ici, `commands()` devient la procédure Tor (télécharger
install-tor.sh par le proxy SOCKS, le lire, l'exécuter) et `direct()` mène à l'index local signé du dépôt.

Échoue (code 1) si le fichier amont a changé de forme : le miroir garde alors sa copie précédente (sync.sh), plutôt que
de publier un portail aux liens clearnet.

Usage : site-tor.py <dossier de release APT>
"""
import re
import sys
from pathlib import Path

PACKAGES_HOST = "rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
SITE_HOST = "bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion"

COMMANDS = """function commands() {
    var ch = state.channel;
    var fr = LANG === 'fr';
    var option = ch === 'stable' ? '' : ' --channel=' + ch;
    return [
      { comment: fr ? '# 1. Télécharger l\\'installateur par Tor (proxy SOCKS 127.0.0.1:9050)' : '# 1. Download the installer through Tor (SOCKS proxy 127.0.0.1:9050)',
        cmd: 'curl --fail --socks5-hostname 127.0.0.1:9050 http://%(site)s/install-tor.sh -o install-tor.sh' },
      { comment: fr ? '# 2. Le lire avant de l\\'exécuter' : '# 2. Read it before running it', cmd: 'less install-tor.sh' },
      { comment: fr ? '# 3. L\\'exécuter : il installe Tor, configure le dépôt signé (APT, DNF ou Pacman) et vérifie l\\'empreinte de la clé' : '# 3. Run it: it installs Tor, configures the signed repository (APT, DNF or Pacman) and checks the key fingerprint',
        cmd: 'bash install-tor.sh' + option }
    ];
  }
""" % {"site": SITE_HOST}

DIRECT = """function direct() {
    var fr = LANG === 'fr';
    var family = state.distro, ch = state.channel;
    return {
      title: fr ? 'Index du dépôt signé (onion)' : 'Signed repository index (onion)',
      meta: fr ? 'Liste des paquets du dépôt, vérifiés par la signature OpenPGP' : 'Package list of the repository, verified by the OpenPGP signature',
      btn: fr ? 'Ouvrir l\\'index' : 'Open the index',
      url: '/' + family + '/' + (family === 'debian' ? '' : ch + '/')
    };
  }
"""

RENDER_SWAPS = (
    ("T.dlTitle(d.ext, d.arch)", "d.title"),
    ("T.dlMeta[state.distro]", "d.meta"),
    ("T.dlBtn(d.ext)", "d.btn"),
)


def patch(text: str) -> str:
    """Renvoie le site.js adapté ; lève ValueError si une ancre amont a disparu."""
    commands = re.search(r"function commands\(\) \{.*?\n  \}\n(?=\n)", text, re.S)
    direct = re.search(r"function direct\(\) \{.*?\n  \}\n(?=\n)", text, re.S)
    if not commands or not direct or commands.start() > direct.start():
        raise ValueError("fonctions commands() et direct() introuvables dans assets/site.js")
    text = text[: direct.start()] + DIRECT + text[direct.end():]
    text = text[: commands.start()] + COMMANDS + text[commands.end():]
    for old, new in RENDER_SWAPS:
        if old not in text:
            raise ValueError(f"appel {old} introuvable dans render()")
        text = text.replace(old, new)
    text = text.replace("https://packages.bobine.fit", f"http://{PACKAGES_HOST}").replace("https://bobine.fit", f"http://{SITE_HOST}")
    return re.sub(r"var RELEASES = '[^']*';\n", "", text)


def main() -> int:
    script = Path(sys.argv[1]) / "assets" / "site.js"
    if not script.is_file():
        print("[site-tor] pas de assets/site.js : rien à adapter")
        return 0
    try:
        script.write_text(patch(script.read_text(encoding="utf-8")), encoding="utf-8")
    except ValueError as exc:
        print(f"[site-tor] adaptation impossible : {exc}", file=sys.stderr)
        return 1
    print("[site-tor] commandes et liens de téléchargement du portail passés au service onion")
    return 0


if __name__ == "__main__":
    sys.exit(main())
