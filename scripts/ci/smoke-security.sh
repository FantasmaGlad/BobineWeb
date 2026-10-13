#!/usr/bin/env bash
# Tests en direct de security.bobine.fit après publication.
set -euo pipefail
SITE=${1:-https://security.bobine.fit}
cd "$(git rev-parse --show-toplevel)"
FPR=$(tr -d '[:space:]' < security/fingerprint.txt)
FPR_SPACED=$(sed -E 's/(.{4})/\1 /g; s/ $//' <<< "$FPR")

attempt() {
  local n=0
  until "$@"; do
    n=$((n + 1))
    [ "$n" -ge 12 ] && return 1
    sleep 20
  done
}

check() {
  local p code page gh out txt
  for p in / /fr/ /snake/ /security.asc /.well-known/security.txt; do
    code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 "$SITE$p") || return 1
    echo "$p -> $code"
    [ "$code" = "200" ] || return 1
  done
  # Page lue en entier avant le grep : "grep -q" ferme le tube et ferait échouer curl sous pipefail.
  page=$(curl -fsS --max-time 30 "$SITE/")
  grep -q "$FPR_SPACED" <<< "$page" || { echo "empreinte absente de la page d'accueil"; return 1; }
  cmp -s <(curl -fsS --max-time 30 "$SITE/security.asc") security/site/security.asc || { echo "security.asc servi différent du dépôt"; return 1; }
  txt=$(mktemp); curl -fsS --max-time 30 "$SITE/.well-known/security.txt" -o "$txt"
  cmp -s "$txt" security/site/.well-known/security.txt || { rm -f "$txt"; echo "security.txt servi différent du dépôt"; return 1; }
  gh=$(mktemp -d)
  gpg --homedir "$gh" --batch --quiet --import security/site/security.asc 2>/dev/null
  out=$(gpg --homedir "$gh" --batch --status-fd 1 --verify "$txt" 2>/dev/null || true)
  rm -rf "$gh" "$txt"
  grep -q "VALIDSIG $FPR" <<< "$out" || { echo "signature invalide"; return 1; }
}

attempt check
echo "Site de sécurité en ligne conforme : $SITE"
