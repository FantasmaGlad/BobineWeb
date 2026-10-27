#!/usr/bin/env bash
# Tests en direct du site après déploiement : ./smoke-web.sh <url> [--www]
#
# Deux modes :
# - par défaut, interroge l'adresse publique avec curl ;
# - avec SMOKE_DEPLOYMENT (adresse du déploiement) et VERCEL_TOKEN, interroge le déploiement lui-même
#   par `vercel curl`. C'est le mode de la CI : la protection anti-bot de Cloudflare refuse les
#   adresses IP des serveurs GitHub (403), ce qui rend l'adresse publique inutilisable depuis un runner.
# Nouvelles tentatives : la propagation d'un déploiement peut prendre quelques dizaines de secondes.
set -euo pipefail
BASE=${1:?base URL}
CHECK_WWW=${2:-}
cd "$(git rev-parse --show-toplevel)"

BASE=$(node scripts/ci/deployment-origin.mjs "$BASE" site)
if [ -n "${SMOKE_DEPLOYMENT:-}" ]; then
  SMOKE_DEPLOYMENT=$(node scripts/ci/deployment-origin.mjs "$SMOKE_DEPLOYMENT" vercel)
fi

# get <chemin> <arguments curl> : une requête vers le site testé.
get() {
  local path=$1; shift
  if [ -n "${SMOKE_DEPLOYMENT:-}" ]; then
    VERCEL_TOKEN="$VERCEL_TOKEN" vercel curl "$path" --deployment "$SMOKE_DEPLOYMENT" --yes -- "$@"
  else
    curl "$@" "$BASE$path"
  fi
}

attempt() {
  local n=0
  until "$@"; do
    n=$((n + 1))
    [ "$n" -ge 6 ] && return 1
    sleep 20
  done
}

check_pages() {
  local p code
  for p in /fr /en /fr/documentation /fr/materiel/amazon /fr/telechargement /robots.txt /sitemap.xml /llms.txt /manifest.webmanifest; do
    code=$(get "$p" -sS -o /dev/null -w '%{http_code}' --max-time 30) || return 1
    echo "$p -> $code"
    [ "$code" = "200" ] || return 1
  done
}

check_headers() {
  local h name
  h=$(get /fr -sSI --max-time 30)
  for name in strict-transport-security x-content-type-options referrer-policy x-frame-options onion-location; do
    grep -qi "^$name:" <<< "$h" || { echo "en-tête absent : $name"; return 1; }
  done
}

check_security_txt() {
  local gh txt out fpr
  fpr=$(tr -d '[:space:]' < security/fingerprint.txt)
  gh=$(mktemp -d); txt=$(mktemp)
  get /.well-known/security.asc -fsS --max-time 30 | gpg --homedir "$gh" --batch --quiet --import 2>/dev/null || true
  get /.well-known/security.txt -fsS --max-time 30 -o "$txt" || true
  out=$(gpg --homedir "$gh" --batch --status-fd 1 --verify "$txt" 2>/dev/null || true)
  rm -rf "$gh" "$txt"
  grep -q "VALIDSIG $fpr" <<< "$out" || { echo "signature de security.txt invalide"; return 1; }
}

check_install_script() {
  local proof result=0
  proof=$(mktemp -d)
  get /install.sh -fsS --max-time 30 -o "$proof/install.sh" &&
    get /install-source.json -fsS --max-time 30 -o "$proof/install-source.json" &&
    node scripts/ci/sync-install.mjs --verify-served "$proof/install.sh" "$proof/install-source.json" || result=1
  rm -rf "$proof"
  return "$result"
}

# Redirection www vers l'apex : uniquement depuis une machine que Cloudflare laisse passer.
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
echo "Site en ligne conforme : ${SMOKE_DEPLOYMENT:-$BASE}"
