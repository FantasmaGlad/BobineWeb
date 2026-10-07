#!/usr/bin/env bash
# Signe public/.well-known/security.txt avec la cle OpenPGP de reception des rapports
# (RFC 9116, section 2.3 : le fichier est signe en clair, "cleartext signature").
#
# Source editable : scripts/security-txt/security.txt (non signe).
# Sortie          : public/.well-known/security.txt (signe, servi tel quel).
#
# A lancer dans un terminal interactif : la phrase secrete est saisie par son
# proprietaire via GnuPG et ne transite jamais par ce script.
set -euo pipefail

KEY="23CAD324C507FB0F97E6AECA6E4C020EF8BDFEB2"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/scripts/security-txt/security.txt"
OUT="$ROOT/public/.well-known/security.txt"

fail() { echo "ERREUR : $*" >&2; exit 1; }

# Controles du fichier source : champs obligatoires (RFC 9116) et Expires valide.
grep -q '^Contact: ' "$SRC" || fail "champ Contact absent"
grep -q '^Expires: ' "$SRC" || fail "champ Expires absent"
grep -q '^-----BEGIN PGP' "$SRC" && fail "la source doit etre non signee"
expires="$(sed -n 's/^Expires: //p' "$SRC")"
expires_s="$(date -u -d "$expires" +%s)" || fail "Expires illisible : $expires"
now_s="$(date -u +%s)"
[ "$expires_s" -gt "$now_s" ] || fail "Expires est deja depasse : $expires"
[ "$expires_s" -lt $((now_s + 366 * 86400)) ] || fail "Expires depasse un an (RFC 9116 recommande moins d'un an)"

# La cle de signature doit etre presente et valide.
gpg --list-secret-keys "$KEY" >/dev/null 2>&1 || fail "cle secrete $KEY absente du trousseau"

export GPG_TTY="$(tty)"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
gpg --batch --yes --armor --digest-algo SHA512 --local-user "$KEY" --clearsign --output "$tmp" "$SRC"

# Verification de la signature produite, puis comparaison avec l'empreinte attendue.
status="$(gpg --status-fd 1 --verify "$tmp" 2>/dev/null)" || fail "signature invalide"
echo "$status" | grep -q "VALIDSIG $KEY" || fail "la signature ne provient pas de la cle $KEY"

install -m 644 "$tmp" "$OUT"
echo "OK : $OUT signe par $KEY, expire le $expires"
