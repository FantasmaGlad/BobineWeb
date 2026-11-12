#!/usr/bin/env python3
"""Commandes d'installation du site : sur le miroir onion, elles passent par le service onion et le proxy SOCKS de Tor."""
import re
import sys
from pathlib import Path

SITE_HOST = "bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion"
APT_HOST = "rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
TEXT_SUFFIXES = {".html", ".js", ".txt", ".json", ".md", ".xml"}
COMMAND = re.compile(
    r"curl(?: -[A-Za-z]+)+ https://(?:bobine\.fit|github\.com/FantasmaGlad/Bobine/releases/(?:latest/download|download/[A-Za-z0-9._-]+))"
    r"/install(?:-tor)?\.sh( \| )(?:sudo )?bash"
)
REPLACEMENT = rf"curl --socks5-hostname 127.0.0.1:9050 -fsSL http://{SITE_HOST}/install-tor.sh\1bash"
PACKAGES_CURL = re.compile(r"curl(?: -[A-Za-z]+)+ https://packages\.bobine\.fit/")
PACKAGES_CURL_REPLACEMENT = f"curl --socks5-hostname 127.0.0.1:9050 -fsSL http://{APT_HOST}/"
PACKAGES = "https://packages.bobine.fit"
REVIEW_DOWNLOAD = re.compile(r"curl(?: -[A-Za-z]+)+ https://bobine\.fit/install(?:-tor)?\.sh -o install(?:-tor)?\.sh")
REVIEW_DOWNLOAD_REPLACEMENT = f"curl --socks5-hostname 127.0.0.1:9050 -fsSL http://{SITE_HOST}/install-tor.sh -o install-tor.sh"


def adapt(root: Path) -> tuple[int, int]:
    files = replaced = 0
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        new, count = COMMAND.subn(REPLACEMENT, text)
        new, review = REVIEW_DOWNLOAD.subn(REVIEW_DOWNLOAD_REPLACEMENT, new)
        if review:
            new = new.replace("less install.sh", "less install-tor.sh").replace("sudo bash install.sh", "bash install-tor.sh")
        count += review
        new, more = PACKAGES_CURL.subn(PACKAGES_CURL_REPLACEMENT, new)
        count += more
        if PACKAGES in new:
            count += new.count(PACKAGES)
            new = new.replace(PACKAGES, f"http://{APT_HOST}")
        if count:
            path.write_text(new, encoding="utf-8")
            files += 1
            replaced += count
    return files, replaced


if __name__ == "__main__":
    files, replaced = adapt(Path(sys.argv[1]))
    print(f"[commands-tor] {replaced} commande(s) adaptée(s) dans {files} fichier(s)")
