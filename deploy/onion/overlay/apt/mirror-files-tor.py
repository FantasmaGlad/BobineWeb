#!/usr/bin/env python3
"""Fichiers du dépôt qui ne servent qu'au web classique : retirés ou réécrits dans la copie servie par Tor."""
import re
import sys
from pathlib import Path

PACKAGES_HOST = "rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
REMOVED = ("README.md", "README.fr.md", "llms.txt", "sitemap.xml", "robots.txt", "CNAME", ".well-known/security.txt")
CLEARNET_LINK = re.compile(r"https?://((?:www\.)?(?:packages\.bobine\.fit|security\.bobine\.fit|bobine\.fit|api\.github\.com|github\.com|raw\.githubusercontent\.com)\b)")


def adapt(root: Path) -> tuple[int, int, int]:
    removed = rewritten = defanged = 0
    for name in REMOVED:
        target = root / name
        if target.is_file():
            target.unlink()
            removed += 1
    for repo in root.glob("*.repo"):
        text = repo.read_text(encoding="utf-8").replace("https://packages.bobine.fit", f"http://{PACKAGES_HOST}")
        if "proxy=" not in text:
            text = text.rstrip("\n") + "\nproxy=socks5h://127.0.0.1:9050\n"
        repo.write_text(text, encoding="utf-8")
        rewritten += 1
    notice = root / "assets" / "NOTICE.md"
    if notice.is_file():
        text = notice.read_text(encoding="utf-8")
        notice.write_text(CLEARNET_LINK.sub(r"\1", text), encoding="utf-8")
        defanged += 1
    return removed, rewritten, defanged


if __name__ == "__main__":
    counts = adapt(Path(sys.argv[1]))
    print("[mirror-files-tor] %d fichier(s) retiré(s), %d .repo réécrit(s), %d notice(s) neutralisée(s)" % counts)
