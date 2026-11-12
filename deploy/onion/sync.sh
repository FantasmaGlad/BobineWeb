#!/usr/bin/env bash
set -euo pipefail

BASE=/srv/onion
mkdir -p "$BASE"
exec 9>"$BASE/.sync.lock"
flock -n 9 || { echo "[onion-sync] une synchronisation est déjà en cours, rien à faire"; exit 0; }
APT_URL=https://github.com/FantasmaGlad/bobine-packages.git
APT_BRANCH=gh-pages
SITE_URL=git@github.com:FantasmaGlad/BobineWeb.git
SITE_BRANCH=onion-site
STATE=${ONION_SYNC_STATE:-/var/lib/onion-sync}
export GIT_SSH_COMMAND="ssh -i $STATE/.ssh/bobineweb_onion_deploy -o IdentitiesOnly=yes -o BatchMode=yes -o UserKnownHostsFile=$STATE/.ssh/known_hosts -o StrictHostKeyChecking=yes"

OVERLAY=/usr/local/lib/bobine-onion/overlay
SITE_KEY=/usr/local/lib/bobine-onion/site-signing.pub.asc
SITE_FPR=/etc/bobine-onion/site-signing.fpr
SITE_BUILT=$BASE/.site-built
PENDING_BUILT=

log() { echo "[onion-sync] $*"; }

[ -r "$STATE/.ssh/known_hosts" ] || log "avertissement : $STATE/.ssh/known_hosts absent ou illisible, la branche du site ne pourra pas être récupérée"

overlay_apt() {
  python3 "$OVERLAY/apt/apt-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/packages-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/site-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/mirror-files-tor.py" "$1" || return 1
  python3 "$OVERLAY/apt/no-clearnet-check.py" "$1" || return 1
}
overlay_none() { :; }
overlay_site() {
  rm -f "$1/vercel.json"
  python3 "$OVERLAY/site/commands-tor.py" "$1" || return 1
  python3 "$OVERLAY/site/check-commands.py" "$1" || return 1
}

verify_site_signature() {
  if [ ! -r "$SITE_FPR" ]; then
    log "avertissement : $SITE_FPR absent, la signature du site n'est pas vérifiée"
    return 0
  fi
  local previous=
  [ ! -r "$SITE_BUILT" ] || previous=$(cat "$SITE_BUILT")
  PENDING_BUILT=$(python3 /usr/local/lib/bobine-onion/site-signature.py verify "$1" --key "$SITE_KEY" \
    --fingerprint "$(cat "$SITE_FPR")" ${previous:+--previous-built "$previous"}) || return 1
}

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
  local name=$1 url=$2 branch=$3 verify=$4 overlay=${5:-overlay_none} pre=${6:-overlay_none}
  local src="$BASE/src/$name.git" sha new cur
  [ "$name" != apt ] || src="$BASE/src/packages.git"
  mkdir -p "$BASE/src" "$BASE/releases"
  [ -d "$src" ] || git init -q --bare "$src"
  git -C "$src" fetch -q --depth 1 --force "$url" "+refs/heads/$branch:refs/heads/$branch" \
    || { log "$name : branche $branch introuvable ou depot injoignable, ancienne copie conservee"; return 1; }
  sha=$(git -C "$src" rev-parse "$branch") || return 1
  new="$BASE/releases/$name-$sha"
  cur=$(readlink "$BASE/$name" || true)
  if [ "$cur" = "$new" ]; then log "$name : a jour ($sha)"; return 0; fi

  rm -rf "$new.tmp"; mkdir -p "$new.tmp"
  git -C "$src" archive "$branch" | tar -x -C "$new.tmp" \
    || { rm -rf "$new.tmp"; log "$name : extraction impossible"; return 1; }
  "$pre" "$new.tmp" || { rm -rf "$new.tmp"; log "$name : signature refusée, ancienne copie conservée"; return 1; }
  "$overlay" "$new.tmp" || { rm -rf "$new.tmp"; log "$name : personnalisation refusée, ancienne copie conservée"; return 1; }
  if ! "$verify" "$new.tmp"; then
    rm -rf "$new.tmp"; log "$name : verification echouee, ancienne copie conservee"; return 1
  fi
  if [ -d "$new" ]; then mv "$new" "$new.backup-$(date +%s)" || return 1; fi
  mv "$new.tmp" "$new" || return 1
  if ! { ln -sfn "$new" "$BASE/$name.tmp" && mv -T "$BASE/$name.tmp" "$BASE/$name"; }; then
    rm -f "$BASE/$name.tmp"; log "$name : bascule impossible, ancienne copie conservée"; return 1
  fi
  local old
  for old in "$BASE/releases/$name-"*; do
    [ -d "$old" ] || continue
    [[ "$old" =~ /$name-[a-f0-9]{40}$ ]] || continue
    [ "$old" = "$new" ] || [ "$old" = "$cur" ] || rm -rf -- "$old"
  done
  for old in "$BASE/releases/$name-"*.backup-*; do
    [ -d "$old" ] && rm -rf -- "$old"
  done
  if [ "$name" = site ] && [ -n "$PENDING_BUILT" ]; then echo "$PENDING_BUILT" > "$SITE_BUILT.tmp" && mv "$SITE_BUILT.tmp" "$SITE_BUILT"; fi
  log "$name : publie ($sha)"
}

status=0
sync_git apt  "$APT_URL"  "$APT_BRANCH"  verify_packages  overlay_apt  || status=1
sync_git site "$SITE_URL" "$SITE_BRANCH" verify_site overlay_site verify_site_signature || status=1
exit $status
