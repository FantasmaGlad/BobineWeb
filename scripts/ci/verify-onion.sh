#!/usr/bin/env bash
# Vérifie l'export statique du miroir Tor (dossier passé en argument, "out" par défaut).
set -euo pipefail
cd "${1:-out}"

test -f fr/index.html || { echo "::error::fr/index.html manquant"; exit 1; }

# La boutique est remplacée par la page de renvoi ; Baamix par son chat (message sans appel réseau).
for page in fr/materiel fr/materiel/amazon fr/materiel/aliexpress en/materiel; do
  grep -q "onion-notice" "$page/index.html" || { echo "::error::Page de renvoi absente : $page"; exit 1; }
done
for page in fr/baamix en/baamix; do
  grep -q "chatbot-modal--page" "$page/index.html" || { echo "::error::Chat Baamix absent : $page"; exit 1; }
done

# Aucun lien marchand ni suivi d'affiliation (un simple texte cité dans une note de version reste permis).
MARCHAND='href="https?://[^"]*(amazon\.[a-z.]+|aliexpress\.[a-z.]+)[^"]*"'
if grep -rIlE "$MARCHAND" --include=*.html . | grep -q .; then
  echo "::error::Lien marchand trouvé dans le miroir :"
  grep -rIlE "$MARCHAND" --include=*.html . | head
  exit 1
fi

# Aucune ressource externe chargée automatiquement (les simples liens cliquables restent permis).
EXT='<(script|img|iframe|source|video)[^>]+src="https?://|<link[^>]+rel="(stylesheet|preload|modulepreload|prefetch|icon|manifest)"[^>]+href="https?://'
if grep -rIhoE "$EXT" --include=*.html . | grep -q .; then
  echo "::error::Ressource externe chargée automatiquement :"
  grep -rIhoE "$EXT" --include=*.html . | sort | uniq -c | head
  exit 1
fi

# Aucun outil de mesure d'audience dans les pages (le composant n'est pas monté ; sa chaîne
# d'URL peut subsister, inerte, dans un chunk JS partagé).
if grep -rIl "_vercel/insights\|vercel-scripts" --include=*.html . | grep -q .; then
  echo "::error::Mesure d'audience présente dans le miroir"
  exit 1
fi
echo "Miroir Tor conforme."
