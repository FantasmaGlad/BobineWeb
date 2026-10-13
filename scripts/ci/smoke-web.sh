#!/usr/bin/env bash
# Tests en direct du site après déploiement : ./smoke-web.sh https://bobine.fit [--www]
# Nouvelles tentatives : la propagation d'un déploiement peut prendre quelques dizaines de secondes.
set -euo pipefail
BASE=${1:?base URL}
CHECK_WWW=${2:-}
cd "$(git rev-parse --show-toplevel)"

attempt() {
  local n=0
  until "$@"; do
    n=$((n + 1))
    [ "$n" -ge 6 ] && return 1
    sleep 20
  done
}

status() { curl -sS -o /dev/null -w '%{http_code}' --max-time 30 "$1"; }

check_pages() {
  local p code
  for p in /fr /en /fr/documentation /fr/materiel/amazon /fr/securite /robots.txt /sitemap.xml /llms.txt /manifest.webmanifest; do
    code=$(status "$BASE$p") || return 1
    echo "$p -> $code"
    [ "$code" = "200" ] || return 1
  done
}

check_headers() {
  local h
  h=$(curl -sSI --max-time 30 "$BASE/fr")
  for name in strict-transport-security x-content-type-options referrer-policy x-frame-options; do
    grep -qi "^$name:" <<< "$h" || { echo "en-tête absent : $name"; return 1; }
  done
}

check_security_txt() {
  local gh txt out fpr
  fpr=$(tr -d '[:space:]' < security/fingerprint.txt)
  gh=$(mktemp -d); trap 'rm -rf "$gh"' RETURN
  curl -fsS --max-time 30 "$BASE/.well-known/security.asc" | gpg --homedir "$gh" --batch --quiet --import 2>/dev/null
  txt=$(mktemp); curl -fsS --max-time 30 "$BASE/.well-known/security.txt" -o "$txt"
  out=$(gpg --homedir "$gh" --batch --status-fd 1 --verify "$txt" 2>/dev/null || true)
  rm -f "$txt"
  grep -q "VALIDSIG $fpr" <<< "$out" || { echo "signature de security.txt invalide"; return 1; }
}

check_install_script() {
  local first
  first=$(curl -fsS --max-time 30 "$BASE/install.sh" | head -c 2)
  [ "$first" = "#!" ] || { echo "install.sh ne commence pas par un shebang"; return 1; }
}

check_www() {
  local loc
  loc=$(curl -sSI --max-time 30 "https://www.${BASE#https://}/" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p' | head -n1)
  case "$loc" in "$BASE"*) ;; *) echo "redirection www inattendue : ${loc:-aucune}"; return 1 ;; esac
}

attempt check_pages
attempt check_headers
attempt check_security_txt
attempt check_install_script
[ "$CHECK_WWW" = "--www" ] && attempt check_www
echo "Site en ligne conforme : $BASE"
