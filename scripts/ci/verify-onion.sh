#!/usr/bin/env bash
set -euo pipefail
cd "${1:-out}"

test -f fr/index.html || { echo "::error::fr/index.html manquant"; exit 1; }

MARCHAND='href="https?://[^"]*(amazon\.[a-z.]+|aliexpress\.[a-z.]+)[^"]*"'
if grep -rIlE "$MARCHAND" --include=*.html . | grep -q .; then
  echo "::error::Lien marchand trouvé dans le miroir :"
  grep -rIlE "$MARCHAND" --include=*.html . | head
  exit 1
fi

EXT='<(script|img|iframe|source|video)[^>]+src="https?://|<link[^>]+rel="(stylesheet|preload|modulepreload|prefetch|icon|manifest)"[^>]+href="https?://'
if grep -rIhoE "$EXT" --include=*.html . | grep -q .; then
  echo "::error::Ressource externe chargée automatiquement :"
  grep -rIhoE "$EXT" --include=*.html . | sort | uniq -c | head
  exit 1
fi

if grep -rIl "_vercel/insights\|vercel-scripts" --include=*.html . | grep -q .; then
  echo "::error::Mesure d'audience présente dans le miroir"
  exit 1
fi
echo "Miroir Tor conforme."
