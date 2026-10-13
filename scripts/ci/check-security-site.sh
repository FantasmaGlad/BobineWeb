#!/usr/bin/env bash
# Contrôle statique du site security.bobine.fit (dossier security/site) avant publication.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

S=security/site
FPR=$(tr -d '[:space:]' < security/fingerprint.txt)
FPR_SPACED=$(sed -E 's/(.{4})/\1 /g; s/ $//' <<< "$FPR")
fail=0
err() { echo "::error::$*"; fail=1; }

[ -f "$S/.nojekyll" ] || err ".nojekyll absent (le dossier .well-known ne serait pas servi)"
[ "$(tr -d '[:space:]' < "$S/CNAME")" = "security.bobine.fit" ] || err "CNAME inattendu"

for f in index.html fr/index.html snake/index.html robots.txt sitemap.xml llms.txt security.asc .well-known/security.txt; do
  [ -s "$S/$f" ] || err "Fichier absent ou vide : $S/$f"
done

# Identité avec les copies servies par le site principal.
cmp -s "$S/security.asc" public/.well-known/security.asc || err "security.asc diffère de public/.well-known/security.asc"
cmp -s "$S/.well-known/security.txt" public/.well-known/security.txt || err "security.txt diffère de public/.well-known/security.txt"

# Empreinte affichée sur les pages.
for f in index.html fr/index.html; do
  grep -q "$FPR_SPACED" "$S/$f" || err "Empreinte absente de $S/$f"
done

# Clé, signature et expirations, dans un trousseau jetable.
gh=$(mktemp -d)
trap 'rm -rf "$gh"' EXIT
gpg --homedir "$gh" --batch --quiet --import "$S/security.asc" 2>/dev/null
got=$(gpg --homedir "$gh" --batch --with-colons --list-keys 2>/dev/null | awk -F: '/^fpr/{print $10; exit}')
[ "$got" = "$FPR" ] || err "Empreinte de la clé publiée : $got (attendue $FPR)"
out=$(gpg --homedir "$gh" --batch --status-fd 1 --verify "$S/.well-known/security.txt" 2>/dev/null || true)
grep -q "VALIDSIG $FPR" <<< "$out" || err "Signature de security.txt invalide"

exp=$(sed -n 's/^Expires: //p' "$S/.well-known/security.txt" | head -n1)
left=$(( ( $(date -u -d "$exp" +%s) - $(date -u +%s) ) / 86400 ))
echo "security.txt expire dans $left jours"
[ "$left" -ge 30 ] || err "security.txt expire dans moins de 30 jours : le renouveler (scripts/security-txt/sign.sh)"

kexp=$(gpg --homedir "$gh" --batch --with-colons --list-keys 2>/dev/null | awk -F: '/^pub/{print $7; exit}')
kleft=$(( ( kexp - $(date -u +%s) ) / 86400 ))
echo "la clé expire dans $kleft jours"
[ "$kleft" -ge 90 ] || err "la clé OpenPGP expire dans moins de 90 jours : la renouveler"

# Liens et ressources locaux des pages.
python3 -I - "$S" <<'PY' || fail=1
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
bad = 0
for page in root.rglob("*.html"):
    html = page.read_text(encoding="utf-8")
    if not re.match(r"\s*<!doctype html>", html, re.I):
        print(f"::error::{page} : doctype absent"); bad = 1
    if not re.search(r"<title>[^<]+</title>", html):
        print(f"::error::{page} : titre absent"); bad = 1
    for ref in re.findall(r'(?:href|src)="([^"#?]+)', html):
        if re.match(r"^(https?:|mailto:|data:|javascript:|//)", ref):
            continue
        target = (root / ref.lstrip("/")) if ref.startswith("/") else (page.parent / ref)
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            print(f"::error::{page} : lien local cassé : {ref}"); bad = 1
sys.exit(bad)
PY

[ "$fail" -eq 0 ] || exit 1
echo "Site de sécurité conforme."
