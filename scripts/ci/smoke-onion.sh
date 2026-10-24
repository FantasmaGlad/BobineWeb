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

PACKAGES_HOST=$(sed -n 's/^export const ONION_APT_HOST = "\(.*\)";/\1/p' src/lib/onion.ts)
[ -n "$PACKAGES_HOST" ] || { echo "adresse onion des paquets absente"; exit 1; }
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
curlt "http://$PACKAGES_HOST/bobine.gpg" -o "$work/key"
fpr=$(gpg --batch --with-colons --show-keys "$work/key" | awk -F: '$1 == "fpr" {print $10; exit}')
[ "$fpr" = B77D96D72F84F36ACAA3F8729CBF497D829EE15A ] || { echo "clé des paquets inattendue"; exit 1; }
mkdir -m 700 "$work/gpg"
gpg --homedir "$work/gpg" --batch --quiet --import "$work/key"
for channel in stable beta canary; do
  curlt "http://$PACKAGES_HOST/debian/dists/$channel/InRelease" -o "$work/InRelease"
  gpg --homedir "$work/gpg" --batch --decrypt "$work/InRelease" > "$work/Release"
  # La compatibilité historique doit donner exactement le même contenu signé.
  curlt "http://$PACKAGES_HOST/dists/$channel/InRelease" -o "$work/legacy"
  cmp "$work/InRelease" "$work/legacy"
  python3 - "$work/Release" <<'PY'
import email.utils
import os
import sys
import time
from pathlib import Path
fields = dict(line.split(': ', 1) for line in Path(sys.argv[1]).read_text().splitlines() if ': ' in line)
now = time.time()
assert now - email.utils.parsedate_to_datetime(fields['Date']).timestamp() < int(os.environ.get('MAX_RELEASE_AGE_DAYS', '90')) * 86400, 'Release trop ancien'
if 'Valid-Until' in fields:
    assert now < email.utils.parsedate_to_datetime(fields['Valid-Until']).timestamp(), 'Release expiré'
PY
  for arch in x86_64 aarch64; do
    for family in fedora arch; do
      if [ "$family" = fedora ]; then file=repodata/repomd.xml; suffix=asc; else file=bobine.db; suffix=sig; fi
      curlt "http://$PACKAGES_HOST/$family/$channel/$arch/$file" -o "$work/metadata"
      curlt "http://$PACKAGES_HOST/$family/$channel/$arch/$file.$suffix" -o "$work/metadata.sig"
      gpg --homedir "$work/gpg" --batch --verify "$work/metadata.sig" "$work/metadata"
    done
  done
done
curlt "http://$PACKAGES_HOST/mirror-packages.json" -o "$work/versions.json"
EXPECTED_VERSION=${EXPECTED_VERSION:-$(curl -fsS --retry 3 https://api.github.com/repos/FantasmaGlad/Bobine/releases/latest | python3 -c 'import json,sys; print(json.load(sys.stdin)["tag_name"].lstrip("vV"))')}
python3 - "$work/versions.json" "$EXPECTED_VERSION" <<'PY'
import json
import sys
from pathlib import Path
versions = json.loads(Path(sys.argv[1]).read_text())['versions']
expected = sys.argv[2]
for family, arches in [('apt', ('amd64', 'arm64')), ('dnf', ('x86_64', 'aarch64')), ('pacman', ('x86_64', 'aarch64'))]:
    for arch in arches:
        values = versions[f'{family}/stable/{arch}']
        assert any(v == expected or v.startswith(expected + '-') for v in values), (family, arch, values, expected)
print(f'Trois dépôts onion : stable {expected}, deux architectures, trois canaux signés')
PY
