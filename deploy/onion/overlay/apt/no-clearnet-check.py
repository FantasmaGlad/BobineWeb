#!/usr/bin/env python3
"""Refuse de publier un miroir onion dont un fichier texte mène au web classique.

Une page, un script ou un fichier .repo qui contient une adresse https de bobine.fit, packages.bobine.fit,
security.bobine.fit ou GitHub fait contacter le clearnet à qui copie la commande ou clique le lien, et expose son
adresse IP. Les overlays réécrivent ces adresses ; ce contrôle échoue si l'une a échappé.

Usage : no-clearnet-check.py <dossier>
"""
import re
import sys
from pathlib import Path

# Les .svg (attributions dans leurs métadonnées, jamais ouvertes comme pages) ne comptent pas.
TEXT_SUFFIXES = {".html", ".js", ".css", ".json", ".txt", ".repo", ".xml", ".webmanifest", ".sh", ".md"}
FORBIDDEN = re.compile(
    r"https?://(?:www\.)?(?:packages\.bobine\.fit|security\.bobine\.fit|bobine\.fit|api\.github\.com|github\.com|"
    r"raw\.githubusercontent\.com|objects\.githubusercontent\.com)\b"
)


def offenders(root: Path) -> list[str]:
    found = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for number, line in enumerate(text.splitlines(), 1):
            match = FORBIDDEN.search(line)
            if match:
                found.append(f"{path.relative_to(root)}:{number}: {match.group(0)}")
    return found


def main() -> int:
    problems = offenders(Path(sys.argv[1]))
    for problem in problems[:20]:
        print(f"[no-clearnet] {problem}", file=sys.stderr)
    if problems:
        print(f"[no-clearnet] {len(problems)} adresse(s) du web classique dans le miroir : publication refusée", file=sys.stderr)
        return 1
    print("[no-clearnet] aucun lien vers le web classique")
    return 0


if __name__ == "__main__":
    sys.exit(main())
