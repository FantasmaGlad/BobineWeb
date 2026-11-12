#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

MOD="src/lib/linuxPackages.ts"
fail=0
err() { echo "::error::$*"; fail=1; }

n="$(grep -cE '^export const PACKAGE_REPOS_LIVE = (true|false);$' "$MOD" || true)"
[ "$n" = "1" ] || err "$MOD : « export const PACKAGE_REPOS_LIVE = true|false; » doit figurer une seule fois, seul sur sa ligne"

for frag in 'bobine_${v}_${a}.deb' 'bobine-${v}-1.${a}.rpm' 'bobine-${v}.${a}.rpm' 'bobine-${v}-1-${a}.pkg.tar.zst' 'bobine-${v}-${a}.pkg.tar.zst'; do
  grep -qF "$frag" "$MOD" || err "$MOD : convention de nom « $frag » absente ou modifiée : mettre à jour scripts/ci/check-release-sync.sh en même temps"
done

fp='B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A'
grep -qF "SIGNING_KEY_FINGERPRINT = \"$fp\"" "$MOD" || err "$MOD : empreinte de la clé de signature différente de $fp"
for logo in debian ubuntu fedora arch; do
  [ -s "public/images/icons/distros/$logo.svg" ] || err "public/images/icons/distros/$logo.svg manquant"
done

hard="$(git grep -lE 'rpm\.bobine\.fit|arch\.bobine\.fit' -- src | grep -v -e "$MOD" -e 'src/content/' -e 'src/components/DocsInstallHub.tsx' -e 'src/components/DocsSearch.tsx' -e 'src/components/JsonLd.tsx' -e 'src/components/TechTicker.tsx' -e 'src/app/api/chat/route.ts' -e 'src/app/\[locale\]/' || true)"
[ -z "$hard" ] || err "Adresse de dépôt rpm. ou arch. écrite à la main hors du module des paquets : $hard"

[ "$fail" -eq 0 ] || exit 1
echo "Paquets Linux cohérents (conventions, empreinte, logos)."
