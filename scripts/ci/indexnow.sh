#!/usr/bin/env bash
# Signale à IndexNow (Bing, Yandex, Seznam, Naver) les adresses du sitemap après un déploiement :
# les moteurs qui s'en servent reprennent les pages en quelques heures au lieu de quelques jours.
# La clé est publique par conception : elle est servie à la racine du site (public/<clé>.txt),
# où IndexNow la relit pour vérifier que le site nous appartient.
# Usage : indexnow.sh [site]   (défaut : https://bobine.fit)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SITE="${1:-https://bobine.fit}"
HOST="${SITE#https://}"
KEY_FILE="$(ls public/*.txt | xargs -n1 basename | grep -E '^[0-9a-f]{32}\.txt$' | head -n1)"
[ -n "$KEY_FILE" ] || { echo "::error::aucune clé IndexNow dans public/"; exit 1; }
KEY="${KEY_FILE%.txt}"

urls="$(curl -fsS --retry 3 --max-time 30 "${SITE}/sitemap.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g')"
[ -n "$urls" ] || { echo "::error::sitemap vide"; exit 1; }

payload="$(printf '%s\n' "$urls" | python3 -I -c "
import json,sys
urls=[l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({'host':'${HOST}','key':'${KEY}','keyLocation':'${SITE}/${KEY_FILE}','urlList':urls}))")"

code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 -X POST "https://api.indexnow.org/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' -d "$payload")"
echo "IndexNow : HTTP ${code} pour $(printf '%s\n' "$urls" | wc -l) adresses"
case "$code" in 200|202) ;; *) echo "::warning::IndexNow a répondu ${code}" ;; esac
