#!/usr/bin/env bash
# Synchronise le depot APT et le site depuis GitHub, verifie, puis bascule
# atomiquement (lien symbolique). En cas d'echec, l'ancienne copie reste servie.
set -euo pipefail

BASE=/srv/onion
mkdir -p "$BASE"
exec 9>"$BASE/.sync.lock"
flock -n 9 || exit 0
APT_URL=https://github.com/FantasmaGlad/bobine-packages.git
APT_BRANCH=gh-pages
SITE_URL=git@github.com:FantasmaGlad/BobineWeb.git
SITE_BRANCH=onion-site
export GIT_SSH_COMMAND="ssh -i /var/lib/onion/.ssh/bobineweb_onion_deploy -o IdentitiesOnly=yes -o BatchMode=yes -o UserKnownHostsFile=/var/lib/onion/.ssh/known_hosts -o StrictHostKeyChecking=yes"

OVERLAY=/usr/local/lib/bobine-onion/overlay

log() { echo "[onion-sync] $*"; }

# Personnalisations propres au miroir Tor (jamais poussees dans le depot source).
overlay_apt() {
  python3 "$OVERLAY/apt/pong-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/apt-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/packages-tor.py" "$1" || return 1
}
overlay_none() { :; }
# vercel.json n'est utile qu'a Vercel (desactive le deploiement de la branche onion-site) : pas sur le miroir.
overlay_site() { rm -f "$1/vercel.json"; }

verify_packages() {
  python3 /usr/local/lib/bobine-onion/verify-packages.py "$1"
}

verify_site() {
  local dir=$1
  for f in fr/index.html en/index.html mirror-info.txt; do
    [ -f "$dir/$f" ] || { log "fichier manquant : $f"; return 1; }
  done
}

sync_git() {
  local name=$1 url=$2 branch=$3 verify=$4 overlay=${5:-overlay_none}
  local src="$BASE/src/$name.git" sha new cur
  [ "$name" != apt ] || src="$BASE/src/packages.git"
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
  "$overlay" "$new.tmp" || { log "$name : personnalisation refusée"; return 1; }
  if ! "$verify" "$new.tmp"; then
    rm -rf "$new.tmp"; log "$name : verification echouee, ancienne copie conservee"; return 1
  fi
  if [ -d "$new" ]; then mv "$new" "$new.backup-$(date +%s)" || return 1; fi
  mv "$new.tmp" "$new" || return 1
  ln -sfn "$new" "$BASE/$name.tmp" && mv -T "$BASE/$name.tmp" "$BASE/$name"
  # Ne supprimer que les générations achevées, en gardant la précédente même
  # si ses horodatages sont plus anciens que ceux d'une tentative interrompue.
  local old
  for old in "$BASE/releases/$name-"*; do
    [ -d "$old" ] || continue
    [[ "$old" =~ /$name-[a-f0-9]{40}$ ]] || continue
    [ "$old" = "$new" ] || [ "$old" = "$cur" ] || rm -rf -- "$old"
  done
  log "$name : publie ($sha)"
}

status=0
sync_git apt  "$APT_URL"  "$APT_BRANCH"  verify_packages  overlay_apt  || status=1
sync_git site "$SITE_URL" "$SITE_BRANCH" verify_site overlay_site || status=1
exit $status
