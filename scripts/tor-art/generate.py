#!/usr/bin/env python3
"""Genere toutes les formes de l'ASCII art « Baamix dans l'oignon » depuis ascii-art.txt.

Le dessin est fait de blocs pleins : une cellule de terminal fait 1 colonne x 2 « unites » de haut,
d'ou le scale(1,2) des SVG. Rendre le dessin en SVG (et non en texte) garantit qu'il ne se deforme
jamais selon la police ou l'appareil.

Sorties (versionnees) :
  - src/lib/torArt.ts                       : chemins SVG pour le site (demo terminal)
  - scripts/tor-art/quadrants.txt           : version compacte 59x40 (quadrants ANSI) pour install-tor.sh

Usage : python3 scripts/tor-art/generate.py
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent

raw = [l.rstrip() for l in (HERE / "ascii-art.txt").read_text(encoding="utf-8").split("\n")]
rows = [i for i, l in enumerate(raw) if l.strip()]
r0, r1 = rows[0], rows[-1]
cols = [c for l in raw for c, ch in enumerate(l) if ch != " "]
c0, c1 = min(cols), max(cols)
W, H = c1 - c0 + 1, r1 - r0 + 1
grid = [[(l[c0 + x] if c0 + x < len(l) else " ") != " " for x in range(W)] for l in raw[r0:r1 + 1]]


def is_leaf(x: int, y: int) -> bool:
    """Feuilles vertes : haut gauche et cote droit du dessin (le reste est violet)."""
    return (x <= 26 and y <= 13) or (x >= 91 and 30 <= y <= 57)


def runs(predicate):
    out = []
    for y in range(H):
        x = 0
        while x < W:
            if grid[y][x] and predicate(x, y):
                s = x
                while x < W and grid[y][x] and predicate(x, y):
                    x += 1
                out.append(f"M{s},{y}h{x - s}v1h-{x - s}z")
            else:
                x += 1
    return " ".join(out)


purple = runs(lambda x, y: not is_leaf(x, y))
green = runs(lambda x, y: is_leaf(x, y))
view_box = f"0 0 {W} {H * 2}"

(ROOT / "src/lib/torArt.ts").write_text(
    "// Genere par scripts/tor-art/generate.py : ne pas modifier a la main.\n"
    "// Baamix dans l'oignon Tor, en ASCII art. Chaque rangee du dessin vaut 2 unites de hauteur (cellule 1:2).\n"
    f"export const TOR_ART = {{\n  cols: {W},\n  rows: {H},\n  viewBox: \"{view_box}\",\n"
    f"  purple: \"{purple}\",\n  green: \"{green}\",\n}} as const;\n",
    encoding="utf-8",
)

# ---- version compacte pour le shell : 2x2 sous-pixels par caractere (quadrants) ----
QUAD = {
    (0, 0, 0, 0): " ", (1, 0, 0, 0): "▘", (0, 1, 0, 0): "▝", (0, 0, 1, 0): "▖", (0, 0, 0, 1): "▗",
    (1, 1, 0, 0): "▀", (0, 0, 1, 1): "▄", (1, 0, 1, 0): "▌", (0, 1, 0, 1): "▐", (1, 0, 0, 1): "▚",
    (0, 1, 1, 0): "▞", (1, 1, 1, 0): "▛", (1, 1, 0, 1): "▜", (1, 0, 1, 1): "▙", (0, 1, 1, 1): "▟",
    (1, 1, 1, 1): "█",
}
pw, ph = W + (W % 2), H + (H % 2)


def px(x, y):
    return 1 if x < W and y < H and grid[y][x] else 0


lines = []
for cy in range(0, ph, 2):
    line, cur = "", None
    for cx in range(0, pw, 2):
        key = (px(cx, cy), px(cx + 1, cy), px(cx, cy + 1), px(cx + 1, cy + 1))
        ch = QUAD[key]
        if ch == " ":
            line += " "
            continue
        leafish = sum(is_leaf(cx + dx, cy + dy) for dx in (0, 1) for dy in (0, 1) if px(cx + dx, cy + dy))
        colour = "G" if leafish * 2 >= sum(key) else "P"
        if colour != cur:
            line += f"@{colour}@"
            cur = colour
        line += ch
    lines.append(line.rstrip())
(HERE / "quadrants.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"art {W}x{H} -> svg {len(purple) + len(green)} o, shell {pw // 2}x{ph // 2}")
