#!/usr/bin/env python3
"""Refuse un miroir onion dont une commande `curl` mène encore au web classique (bobine.fit, packages.bobine.fit, GitHub).

Les simples liens cliquables du site restent permis (voir scripts/ci/verify-onion.sh) ; une commande, elle, se copie et
s'exécute telle quelle.

Usage : check-commands.py <dossier du site exporté>
"""
import re
import sys
from pathlib import Path

TEXT_SUFFIXES = {".html", ".js", ".txt", ".json", ".md", ".xml", ".sh"}
EXEMPT = {"install.sh", "install-tor.sh"}  # les installateurs eux-mêmes ne sont pas des pages
CLEARNET_CURL = re.compile(
    r"curl\b[^\n]{0,120}?https?://(?:www\.)?(?:packages\.bobine\.fit|security\.bobine\.fit|bobine\.fit|github\.com|"
    r"raw\.githubusercontent\.com)\b"
)


def offenders(root: Path) -> list[str]:
    found = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES or path.name in EXEMPT:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for match in CLEARNET_CURL.finditer(text):
            found.append(f"{path.relative_to(root)}: {match.group(0)[:110]}")
    return found


if __name__ == "__main__":
    problems = offenders(Path(sys.argv[1]))
    for problem in problems[:15]:
        print(f"[check-commands] {problem}", file=sys.stderr)
    if problems:
        print(f"[check-commands] {len(problems)} commande(s) vers le web classique : publication refusée", file=sys.stderr)
        sys.exit(1)
    print("[check-commands] aucune commande vers le web classique")
