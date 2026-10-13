#!/usr/bin/env bash
# Interroge le VRAI service onion par Tor (SOCKS5 sur 127.0.0.1:9050) : site, âge du miroir, installateur.
# Variables : EXPECTED_SHA (préfixe du commit attendu dans mirror-info.txt, facultatif),
# ATTEMPTS (nombre d'essais espacés de 60 s, 4 par défaut).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
HOST=$(sed -n 's/^export const ONION_SITE_HOST = "\(.*\)";/\1/p' src/lib/onion.ts)
[ -n "$HOST" ] || { echo "::error::adresse onion introuvable dans src/lib/onion.ts"; exit 1; }
curlt() { curl -fsS --max-time 120 --socks5-hostname 127.0.0.1:9050 "$@"; }

attempt() {
  local n=0
  until "$@"; do
    n=$((n + 1))
    [ "$n" -ge "${ATTEMPTS:-4}" ] && return 1
    echo "nouvelle tentative dans 60 s"; sleep 60
  done
}

check() {
  local code info built age
  code=$(curlt -o /dev/null -w '%{http_code}' "http://$HOST/fr/") || return 1
  echo "/fr/ -> $code"; [ "$code" = "200" ] || return 1
  info=$(curlt "http://$HOST/mirror-info.txt") || return 1
  echo "$info"
  if [ -n "${EXPECTED_SHA:-}" ]; then
    grep -q "@${EXPECTED_SHA}" <<< "$info" || { echo "le miroir ne porte pas le commit attendu (${EXPECTED_SHA})"; return 1; }
  fi
  built=$(sed -n 's/^built: //p' <<< "$info")
  age=$(( ( $(date -u +%s) - $(date -u -d "$built" +%s) ) / 3600 ))
  echo "miroir construit il y a $age h"
  [ "$age" -le 72 ] || { echo "miroir trop ancien"; return 1; }
  cmp -s <(curlt "http://$HOST/install-tor.sh") public/install-tor.sh || { echo "install-tor.sh servi différent du dépôt"; return 1; }
}

attempt check
echo "Miroir Tor en ligne conforme : http://$HOST/"
