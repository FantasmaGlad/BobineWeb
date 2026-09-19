#!/usr/bin/env bash
# Synchronise le depot APT et le site depuis GitHub, verifie, puis bascule
# atomiquement (lien symbolique). En cas d'echec, l'ancienne copie reste servie.
set -euo pipefail

BASE=/srv/onion
APT_URL=https://github.com/FantasmaGlad/Bobine.git
APT_BRANCH=gh-pages
SITE_URL=git@github.com:FantasmaGlad/BobineWeb.git
SITE_BRANCH=onion-site
# Empreinte attendue de la SOUS-CLE de signature des paquets (cle principale : B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A).
APT_FPR=941B6F526A7259F4694CF4BC1B5D18A976FAAD15

export GIT_SSH_COMMAND="ssh -i /var/lib/onion/.ssh/bobineweb_onion_deploy -o IdentitiesOnly=yes -o BatchMode=yes -o UserKnownHostsFile=/var/lib/onion/.ssh/known_hosts -o StrictHostKeyChecking=yes"

log() { echo "[onion-sync] $*"; }

verify_apt() {
  # Sous-shell : le trousseau temporaire est toujours supprime en sortie.
  (
    dir=$1
    gh=$(mktemp -d)
    trap 'rm -rf "$gh"' EXIT
    [ -f "$dir/bobine.gpg" ] || { log "bobine.gpg absent"; exit 1; }
    gpg --homedir "$gh" --batch --quiet --import "$dir/bobine.gpg"
    gpg --homedir "$gh" --batch --with-colons --fingerprint | grep -q "^fpr:::::::::${APT_FPR}:" \
      || { log "empreinte de la cle inattendue"; exit 1; }
    seen=0
    for d in stable beta; do
      if [ -f "$dir/dists/$d/InRelease" ]; then
        gpg --homedir "$gh" --batch --quiet --verify "$dir/dists/$d/InRelease" 2>/dev/null \
          || { log "signature invalide : dists/$d/InRelease"; exit 1; }
        seen=1
      fi
    done
    [ "$seen" = 1 ] || { log "aucun InRelease"; exit 1; }
  )
}

verify_site() {
  local dir=$1
  for f in fr/index.html en/index.html mirror-info.txt; do
    [ -f "$dir/$f" ] || { log "fichier manquant : $f"; return 1; }
  done
}

sync_git() {
  local name=$1 url=$2 branch=$3 verify=$4
  local src="$BASE/src/$name.git" sha new cur
  mkdir -p "$BASE/src" "$BASE/releases"
  [ -d "$src" ] || git init -q --bare "$src"
  # (dans un "|| ...", set -e est inactif : chaque etape est donc testee explicitement)
  git -C "$src" fetch -q --depth 1 --force "$url" "+refs/heads/$branch:refs/heads/$branch" \
    || { log "$name : branche $branch introuvable ou depot injoignable, ancienne copie conservee"; return 1; }
  sha=$(git -C "$src" rev-parse "$branch") || return 1
  new="$BASE/releases/$name-$sha"
  cur=$(readlink "$BASE/$name" || true)
  if [ "$cur" = "$new" ]; then log "$name : a jour ($sha)"; return 0; fi

  rm -rf "$new.tmp"; mkdir -p "$new.tmp"
  git -C "$src" archive "$branch" | tar -x -C "$new.tmp" \
    || { rm -rf "$new.tmp"; log "$name : extraction impossible"; return 1; }
  if ! "$verify" "$new.tmp"; then
    rm -rf "$new.tmp"; log "$name : verification echouee, ancienne copie conservee"; return 1
  fi
  rm -rf "$new"; mv "$new.tmp" "$new"
  ln -sfn "$new" "$BASE/$name.tmp" && mv -T "$BASE/$name.tmp" "$BASE/$name"
  ls -dt "$BASE"/releases/"$name"-* 2>/dev/null | tail -n +3 | xargs -r rm -rf
  log "$name : publie ($sha)"
}

status=0
sync_git apt  "$APT_URL"  "$APT_BRANCH"  verify_apt  || status=1
sync_git site "$SITE_URL" "$SITE_BRANCH" verify_site || status=1
exit $status
