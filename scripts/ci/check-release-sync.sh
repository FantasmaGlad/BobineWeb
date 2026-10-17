#!/usr/bin/env bash
# Cohérence entre le dépôt Bobine et ce site : install.sh servi par le site identique à celui de
# Bobine (branche main), et chaque canal (Stable, Bêta, Canary) publié avec tous les fichiers que
# les téléchargements du site désignent (src/lib/githubApi.ts, src/lib/releaseChannels.ts).
# Les noms attendus sont ceux de scripts/ci/verify-release-assets.sh du dépôt Bobine.
# Variable facultative : GITHUB_TOKEN (limite de débit de l'API GitHub).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

REPO="FantasmaGlad/Bobine"
fail=0
err() { echo "::error::$*"; fail=1; }

api() {
  curl -fsS --retry 3 --max-time 30 -H "Accept: application/vnd.github+json" \
    ${GITHUB_TOKEN:+-H "Authorization: Bearer ${GITHUB_TOKEN}"} "https://api.github.com/repos/${REPO}/$1"
}

upstream="$(curl -fsS --retry 3 --max-time 30 "https://raw.githubusercontent.com/${REPO}/main/install.sh" | sha256sum | cut -d' ' -f1)"
local_sum="$(sha256sum public/install.sh | cut -d' ' -f1)"
if [ "$upstream" != "$local_sum" ]; then
  err "public/install.sh diffère de install.sh sur la branche main de ${REPO} : le recopier"
fi

releases="$(api "releases?per_page=100")"

check_channel() {
  local label="$1" tag="$2" suffix="$3" names name
  names="$(jq -r --arg t "$tag" '.[] | select(.tag_name == $t and (.draft | not)) | .assets[].name' <<<"$releases")"
  if [ -z "$names" ]; then
    err "$label : aucune release publiée sous le tag $tag"
    return
  fi
  for name in \
    "Bobine-Setup-${suffix}.exe" "Bobine-Setup-${suffix}-arm64.exe" \
    "bobine_${suffix}_amd64.deb" "bobine_${suffix}_arm64.deb" \
    "Bobine-${suffix}.dmg" "Bobine-${suffix}.apk" "Bobine-TV-${suffix}.apk" \
    bobine-assistant bobine-assistant-arm64 install.sh; do
    grep -qxF "$name" <<<"$names" || err "$label ($tag) : fichier $name absent"
  done
  echo "$label ($tag) : fichiers attendus présents"
}

stable_tag="$(jq -r '[.[] | select(.prerelease == false and .draft == false)][0].tag_name // empty' <<<"$releases")"
if [ -z "$stable_tag" ]; then
  err "Stable : aucune release stable publiée"
else
  check_channel "Stable" "$stable_tag" "${stable_tag#V}"
  fallback="$(sed -n 's/^  version: "\(V[0-9.]*\)",$/\1/p' src/lib/releaseFallbacks.ts | head -n1)"
  if [ "$fallback" != "$stable_tag" ]; then
    echo "::warning::liens de repli du site (src/lib/releaseFallbacks.ts) sur $fallback alors que la Stable publiée est $stable_tag"
  fi
fi
check_channel "Bêta" beta beta
check_channel "Canary" canary canary

exit "$fail"
