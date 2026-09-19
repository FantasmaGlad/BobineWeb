#!/usr/bin/env python3
"""Variante Tor du Pong (easter egg) : la balle devient le logo Tor, qui tourne.

Applique de petits remplacements sur le Pong publie dans le depot APT (branche gh-pages
de Bobine), sans jamais y toucher dans le depot source. Si une seule ancre est introuvable
(le Pong amont a change), la copie amont est laissee intacte : rien ne casse.

Usage : pong-tor.py <dossier de release APT>
"""
import shutil
import sys
from pathlib import Path

release = Path(sys.argv[1])
page = release / "pong" / "index.html"
logo = Path(__file__).with_name("pong") / "tor.webp"

if not page.is_file():
    print("[pong-tor] pong/index.html absent : rien a faire")
    sys.exit(0)

html = page.read_text(encoding="utf-8")

if "torImg" in html:
    print("[pong-tor] deja applique")
    sys.exit(0)

replacements = [
    # 1. la balle : plus grande, avec un angle, et l'image du logo
    (
        "    const ball = {\n      x: 400,\n      y: 300,\n      size: 12,",
        '    const torImg = new Image();\n    torImg.src = "tor.webp";\n\n'
        "    const ball = {\n      angle: 0,\n      x: 400,\n      y: 300,\n      size: 30,",
    ),
    # 2. la rotation suit le deplacement (plus vite quand la balle accelere)
    (
        "      ball.x += ball.vx;\n      ball.y += ball.vy;\n",
        "      ball.x += ball.vx;\n      ball.y += ball.vy;\n"
        "      ball.angle += 0.12 * (ball.vx < 0 ? -1 : 1) * (ball.speed / 8);\n",
    ),
    # 3. le dessin : le logo, tournant autour de son centre (carre de repli si l'image manque)
    (
        "      roundRect(ctx, ball.x, ball.y, ball.size, ball.size, 2);\n      ctx.fill();\n    }\n\n    function gameLoop",
        "      if (torImg.complete && torImg.naturalWidth > 0) {\n"
        "        ctx.save();\n"
        "        ctx.translate(ball.x + ball.size / 2, ball.y + ball.size / 2);\n"
        "        ctx.rotate(ball.angle);\n"
        "        ctx.drawImage(torImg, -ball.size / 2, -ball.size / 2, ball.size, ball.size);\n"
        "        ctx.restore();\n"
        "      } else {\n"
        "        roundRect(ctx, ball.x, ball.y, ball.size, ball.size, 2);\n"
        "        ctx.fill();\n"
        "      }\n    }\n\n    function gameLoop",
    ),
]

for old, _ in replacements:
    if html.count(old) != 1:
        print("[pong-tor] ancre introuvable ou ambigue : Pong amont conserve tel quel")
        sys.exit(0)

for old, new in replacements:
    html = html.replace(old, new, 1)

page.write_text(html, encoding="utf-8")
shutil.copyfile(logo, page.parent / "tor.webp")
print("[pong-tor] balle remplacee par le logo Tor")
