#!/usr/bin/env bash
#
# install-tor.sh — Bobine : dépôts Linux protégés via Tor (service onion)
#
# Configure apt, dnf ou pacman et Tor, récupère la clé de signature de Bobine (par Tor, sans contacter le web
# classique), vérifie son empreinte contre celle publiée, puis configure le dépôt signé en .onion.
# À LIRE AVANT de l'exécuter. Il s'arrête si l'empreinte de la clé diffère.
#
#   curl -fsSL https://bobine.fit/install-tor.sh | bash
#   curl -fsSL https://bobine.fit/install-tor.sh | bash -s -- --dry-run     # ne modifie rien
#   curl -fsSL https://bobine.fit/install-tor.sh | bash -s -- --channel=beta
#
# Options : --dry-run   simule (télécharge et vérifie la clé, n'installe rien)
#           --channel=stable|beta|canary   canal de mise à jour (sans l'option : question sur un terminal, sinon stable)
#           --lang=en   messages en anglais
#           --clearnet-key   récupère la clé sur https://packages.bobine.fit (révèle votre IP à ce serveur)
#
set -euo pipefail

APT_ONION="rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
PRIMARY_FPR="B77D96D72F84F36ACAA3F8729CBF497D829EE15A"
KEY_DEST="/etc/apt/keyrings/bobine.gpg"
LIST_DEST="/etc/apt/sources.list.d/bobine-onion.list"
TOTAL=5

DRY_RUN=0; CLEARNET_KEY=0; LANG_OUT="fr"; CHANNEL=""
[[ "${LANG:-}" == en* ]] && LANG_OUT="en"
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=1 ;;
        --lang=en) LANG_OUT="en" ;;
        --lang=fr) LANG_OUT="fr" ;;
        --clearnet-key) CLEARNET_KEY=1 ;;
        --channel=*) CHANNEL="${arg#*=}" ;;
        -h|--help) sed -n '2,16p' "$0" 2>/dev/null || true; exit 0 ;;
        *) echo "Option inconnue : $arg" >&2; exit 2 ;;
    esac
done

# ---------------------------------------------------------------- couleurs (palette Tor)
if [[ -t 1 ]] && [[ "${NO_COLOR:-}" != "1" ]] && command -v tput >/dev/null 2>&1 && [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
    BOLD=$(tput bold); DIM=$(tput dim); RESET=$(tput sgr0)
    RED=$(tput setaf 1); YELLOW=$(tput setaf 3)
    if [[ "$(tput colors)" -ge 256 ]]; then
        PURPLE=$(tput setaf 97); LEAF=$(tput setaf 71)
    else
        PURPLE=$(tput setaf 5); LEAF=$(tput setaf 2)
    fi
    GREEN=$LEAF
else
    BOLD=""; DIM=""; RESET=""; RED=""; YELLOW=""; PURPLE=""; LEAF=""; GREEN=""
fi

ICON_OK="${GREEN}[OK]${RESET}"
ICON_FAIL="${RED}[ERREUR]${RESET}"
ICON_INFO="${PURPLE}->${RESET}"

t() { [[ "$LANG_OUT" == "en" ]] && printf '%s' "$2" || printf '%s' "$1"; }

# ---------------------------------------------------------------- bannière : Baamix dans l'oignon
banner() {
    local cols line
    cols=$(tput cols 2>/dev/null || echo 80)
    printf "\n"
    if (( cols >= 62 )); then
        while IFS= read -r line; do
            line=${line//@G@/$LEAF}
            line=${line//@P@/$PURPLE}
            printf '  %s%s\n' "$line" "$RESET"
        done <<'ART'
      @G@▙▗
@G@▗▖    █▞▌  ▗▖
 @G@▝▜▄ ▞▝██▖ █
  @G@▘▟▜█▌▝██▐█
@G@▄▄▄▄▘▝█▖▜█▖█▖
 @G@▝▀▀█▙▟▀▖▜▀▜█▄@P@▖
     @G@▝▜█▟▐▛▘▄ @P@▀▀▀▀▀▀▘ ▄▟▛▙▄▖
       @P@▜█ ▌ ▄  ▀▀▀▀ ▗▄▄  ▀▚▛█▙▖
       @P@█▛▗▘▐   ▀ ▄▄▖   ▝▘▄  ▚▛██▄
      @P@▟▛ ▞ ▐        ▀▀▄▖  ▀▖ ▝▟██▙
     @P@▞▛ ▞  ▛           ▝▚▖ ▗▙█▄▖▐█▘
    @P@▟▟ ▗▘ ▗▘           ▄▄▝▀▄▄ ▞▄▛▘
   @P@▐▌▌ ▟  ▐       ▗▄▄▟▀▀▀▜ ▞▚▙▞▘
   @P@█▌▌ ▜  ▐     ▗█▛▀   ▟▟▌▀▄▀▘
  @P@▐█▌▌ ▐▖ ▝▌ ▗▟█▛▘ ▄▄▙█▀▙▞▘
  @P@▐█▙▜  ▙ ▄▜▛▛▚▖▄▟█▛▜▙▞▘                                @G@▖
  @P@▐██▌▙▄▟▀▐▘▝▘██▀▜▄▀▘▄    ▜▙▖        ▐▖           @G@▗   ▗█▘
   @P@███▛▐▙▄▝▀▛▜▄▀▀ ▗▞▘     ▀           ▘           @G@█▖ ▐█▘ ▗▖
   @P@▐██▄▄▄▄▞▀▀▘   ▝▘           ▄▖    ▗▖            @G@▛█▙█▛▗▟▀
    @P@▝▀▀▘                     ▝█▛    ▝█           @G@▐▌██▛▟▛
                                                 @G@▟▐█▚▟▛
                                  @P@▄▄            @G@▐▌█▚█▘
         @P@▄▖▀▀▀▘█▀▄▟▄▄▄▄▖  ▝▀▗▄▄▄▄▄▟▄▄▄▌ ▄▖      @G@▛▐▙█▘
       @P@▗██▄▄▖ ▗▖  ▗▖  ▗  ▘▀▀▝▀█▀▀▀▛▀▘▟▄▟██▄    @G@▟▚██
       @P@███▚▛ ▗▛  ▗▘  ▗▘     ▚▖▝▙  ▝▖ ▝▙████▖  @G@▟▘▟█▛
      @P@▐██▙█  ▛  ▗▘  ▗▘       ▜▖▝▙  ▐▖ ▜▞████ @G@▟▘▐██
      @P@▟███▌ ▐▘ ▗▛  ▗▘         ▜ ▝▌  ▚  ████▟▟@G@█▄██▌
      @P@████  ▛  ▟   ▛           ▚ ▜  ▐▖ ▜████▛@G@███▛
      @P@███▌ ▐▌  ▌  ▐            ▝▖▝▌  ▌ ▐████▖
      @P@███▌ ▐  ▐▘  ▌             ▌ ▌  █ ▝████▌
      @P@███▌ ▐  ▐   ▌       ▝     ▌ █  █ ▐████▌
      @P@▜██▙ ▝▌ ▐▖  ▌             ▌ ▌  ▌ ▐████
       @P@███▖ ▚  ▌  ▚             ▘▗▌ ▐▘ ████▘
       @P@▝███▖▝▌ ▐  ▝▖           ▞ ▞ ▗▛ ▟███▀
        @P@▝███▖▝▙ ▚  ▚       ▌    ▟▘▗▛ ▟███▛
         @P@▝▜██▄▝▚▖▀▖ ▗     ▐ ▞  ▞▘▄▘▗▜██▛▘
           @P@▝███▄▝▗▞▚    ▝▀▘▝▘▖▀▄▀▗▟███▀
             @P@▝▀██▄▄▘▝ ▀▀▀▀▀▀▌ ▚▄█▟▛▀▘
                 @P@▀▀██▄▄   ▗▄▟█▟▀▀
                     @P@▀▀▀▀▀▀▀▀
ART
    else
        printf '%s%s  Bobine%s %s· Tor%s\n' "$BOLD" "$PURPLE" "$RESET" "$DIM" "$RESET"
    fi
    printf '\n%s%s  %s%s\n' "$BOLD" "$PURPLE" "$(t "Dépôts Linux protégés via Tor (service onion)" "Linux repositories protected through Tor (onion service)")" "$RESET"
    printf '%s  %s%s\n' "$DIM" "$(t "Mêmes paquets, même signature, sans révéler votre adresse IP." "Same packages, same signature, without revealing your IP address.")" "$RESET"
    printf '%s  tor+http://%s%s\n\n' "$DIM" "$APT_ONION" "$RESET"
}

case "${CHANNEL,,}" in
    ""|stable|beta|canary) CHANNEL="${CHANNEL,,}" ;;
    *) echo "Canal inconnu : ${CHANNEL} (stable, beta ou canary)" >&2; exit 2 ;;
esac

n=0
step() { n=$((n + 1)); printf '%s[%d/%d]%s %s%s%s\n' "$DIM" "$n" "$TOTAL" "$RESET" "$BOLD" "$1" "$RESET"; }
ok()   { printf '      %s %s\n' "$ICON_OK" "$1"; }
info() { printf '      %s %s\n' "$ICON_INFO" "$1"; }
die()  { printf '      %s %s\n' "$ICON_FAIL" "$1" >&2; exit 1; }

run() { # exécute (ou simule) une commande privilégiée
    if (( DRY_RUN )); then info "${DIM}[dry-run] $*${RESET}"; else "$@"; fi
}

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

banner

# Canal de mise à jour : option, sinon question sur un vrai terminal, sinon stable.
select_channel() {
    [[ -n "$CHANNEL" ]] && return 0
    CHANNEL="stable"
    [[ -t 1 ]] && (: </dev/tty) 2>/dev/null || return 0
    local reply
    printf '%s%s  %s%s\n' "$BOLD" "$PURPLE" "$(t "Canal de mise à jour :" "Update channel:")" "$RESET"
    printf '    %s1%s) %s\n' "$PURPLE" "$RESET" "$(t "Stable (par défaut, recommandé)" "Stable (default, recommended)")"
    printf '    %s2%s) %s\n' "$PURPLE" "$RESET" "$(t "Bêta : lots de fonctionnalités sélectionnés avant publication" "Beta: feature batches picked before release")"
    printf '    %s3%s) %s\n' "$PURPLE" "$RESET" "$(t "Canary : dernier commit de la branche principale, non testé" "Canary: latest commit of the main branch, untested")"
    read -r -p "$(printf '%s  %s%s' "$YELLOW" "$(t "Votre choix [1/2/3] (1) : " "Your choice [1/2/3] (1): ")" "$RESET")" reply </dev/tty || reply="1"
    case "${reply:-1}" in
        2) CHANNEL="beta" ;;
        3) CHANNEL="canary" ;;
    esac
    echo
}
select_channel
(( DRY_RUN )) && info "$(t "Mode simulation : rien ne sera installé ni modifié." "Dry-run mode: nothing will be installed or changed.")" && echo

# ---------------------------------------------------------------- 1. environnement
step "$(t "Vérification de l'environnement" "Checking the environment")"
if command -v apt-get >/dev/null 2>&1; then FAMILY=apt
elif command -v dnf >/dev/null 2>&1; then FAMILY=dnf
elif command -v pacman >/dev/null 2>&1; then FAMILY=pacman
else die "$(t "Gestionnaire requis : apt, dnf ou pacman." "Required package manager: apt, dnf or pacman.")"; fi
command -v curl >/dev/null 2>&1 || die "curl requis / required"
command -v gpg >/dev/null 2>&1 || die "gpg requis / required"
SUDO=()
if (( EUID != 0 )); then command -v sudo >/dev/null || die "sudo requis / required"; SUDO=(sudo); fi
ok "$FAMILY, curl, gpg"

step "$(t "Transport Tor" "Tor transport")"
case "$FAMILY" in
    apt) run "${SUDO[@]}" apt-get install -y apt-transport-tor ;;
    dnf) run "${SUDO[@]}" dnf install -y tor ;;
    pacman) run "${SUDO[@]}" pacman -Syu --needed --noconfirm tor ;;
esac
if command -v systemctl >/dev/null 2>&1 && [[ -d /run/systemd/system ]]; then
    run "${SUDO[@]}" systemctl enable --now tor
fi

# ---------------------------------------------------------------- 3. clé de signature
step "$(t "Clé de signature de Bobine" "Bobine signing key")"
KEY_FILE="$TMP/bobine.gpg"
if (( CLEARNET_KEY )); then
    curl -fsSL https://packages.bobine.fit/bobine.gpg -o "$KEY_FILE" || die "$(t "Téléchargement de la clé impossible" "Could not download the key")"
    ok "$(t "Clé téléchargée depuis packages.bobine.fit (web classique)" "Key downloaded from packages.bobine.fit (regular web)")"
elif (( DRY_RUN )) && ! (exec 3<>/dev/tcp/127.0.0.1/9050) 2>/dev/null; then
    info "$(t "Aucun proxy Tor local (127.0.0.1:9050) : étape réseau ignorée en simulation" "No local Tor proxy (127.0.0.1:9050): network step skipped in dry-run")"
else
    got=0
    for attempt in 1 2 3 4 5 6; do
        if curl -fsS --max-time 45 --socks5-hostname 127.0.0.1:9050 "http://${APT_ONION}/bobine.gpg" -o "$KEY_FILE" 2>/dev/null; then got=1; break; fi
        info "$(t "Tor s'initialise, nouvel essai ($attempt/6)…" "Tor is starting up, retrying ($attempt/6)…")"
        sleep 8
    done
    (( got )) || die "$(t "Clé injoignable par Tor. Réessayez plus tard, ou utilisez --clearnet-key." "Key unreachable through Tor. Try again later, or use --clearnet-key.")"
    ok "$(t "Clé récupérée par Tor (aucun contact avec le web classique)" "Key fetched through Tor (no contact with the regular web)")"
fi

# ---------------------------------------------------------------- 4. empreinte
step "$(t "Vérification de l'empreinte" "Fingerprint check")"
if [[ -s "$KEY_FILE" ]]; then
    got_fpr=$(gpg --show-keys --with-colons "$KEY_FILE" | awk -F: '/^fpr:/ {print $10; exit}')
    if [[ "$got_fpr" != "$PRIMARY_FPR" ]]; then
        die "$(t "Empreinte inattendue : ${got_fpr:-aucune}. Arrêt par sécurité." "Unexpected fingerprint: ${got_fpr:-none}. Stopping for safety.")"
    fi
    ok "B77D 96D7 2F84 F36A CAA3  F872 9CBF 497D 829E E15A ${DIM}$(t "(conforme)" "(matches)")${RESET}"
else
    info "$(t "Aucune clé à vérifier en simulation" "No key to check in dry-run")"
fi

# ---------------------------------------------------------------- 5. dépôt signé
step "$(t "Dépôt signé via Tor" "Signed repository through Tor")"
BASE="http://${APT_ONION}"
case "$FAMILY" in
    apt)
        run "${SUDO[@]}" install -d -m 755 /etc/apt/keyrings
        if (( ! DRY_RUN )); then
            gpg --batch --yes --dearmor -o "$TMP/keyring.gpg" "$KEY_FILE"
            "${SUDO[@]}" install -m 644 "$TMP/keyring.gpg" "$KEY_DEST"
        fi
        printf 'deb [signed-by=%s] tor+%s/debian %s main\n' "$KEY_DEST" "$BASE" "$CHANNEL" > "$TMP/source"
        LIST_DEST=/etc/apt/sources.list.d/bobine-onion.list
        run "${SUDO[@]}" install -m 644 "$TMP/source" "$LIST_DEST"
        run "${SUDO[@]}" apt-get update
        INSTALL="sudo apt install bobine"; UPDATE="sudo apt update && sudo apt upgrade"
        ;;
    dnf)
        KEY_DEST=/etc/pki/rpm-gpg/BOBINE-ONION
        LIST_DEST=/etc/yum.repos.d/bobine-onion.repo
        run "${SUDO[@]}" install -d -m 755 /etc/pki/rpm-gpg /etc/yum.repos.d
        run "${SUDO[@]}" install -m 644 "$KEY_FILE" "$KEY_DEST"
        cat > "$TMP/source" <<EOF
[bobine-onion]
name=Bobine via Tor ($CHANNEL)
baseurl=$BASE/fedora/$CHANNEL/\$basearch/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=file://$KEY_DEST
proxy=socks5h://127.0.0.1:9050
EOF
        run "${SUDO[@]}" install -m 644 "$TMP/source" "$LIST_DEST"
        run "${SUDO[@]}" dnf -y --disablerepo='*' --enablerepo=bobine-onion makecache
        INSTALL="sudo dnf install bobine"; UPDATE="sudo dnf upgrade --refresh"
        ;;
    pacman)
        LIST_DEST=/etc/pacman.d/bobine-onion.conf
        run "${SUDO[@]}" pacman-key --init
        run "${SUDO[@]}" pacman-key --add "$KEY_FILE"
        run "${SUDO[@]}" pacman-key --lsign-key "$PRIMARY_FPR"
        # Un XferCommand global ferait passer tous les dépôts par Tor et modifierait
        # le choix de transport du poste. Le wrapper n'utilise Tor que pour .onion.
        cat > "$TMP/transfer" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
case "$1" in
    http://*.onion/*) exec curl --fail --location --socks5-hostname 127.0.0.1:9050 --output "$2" "$1" ;;
    *) exec curl --fail --location --output "$2" "$1" ;;
esac
EOF
        run "${SUDO[@]}" install -m 755 "$TMP/transfer" /usr/local/bin/bobine-pacman-transfer
        cat > "$TMP/source" <<EOF
[options]
XferCommand = /usr/local/bin/bobine-pacman-transfer %u %o
[bobine]
SigLevel = Required DatabaseRequired
Server = $BASE/arch/$CHANNEL/\$arch
EOF
        run "${SUDO[@]}" install -m 644 "$TMP/source" "$LIST_DEST"
        if (( ! DRY_RUN )) && ! grep -q '^Include = /etc/pacman.d/bobine-onion.conf$' /etc/pacman.conf; then
            printf '\nInclude = /etc/pacman.d/bobine-onion.conf\n' | "${SUDO[@]}" tee -a /etc/pacman.conf >/dev/null
        fi
        run "${SUDO[@]}" pacman -Syu --noconfirm
        INSTALL="sudo pacman -Syu bobine"; UPDATE="sudo pacman -Syu"
        ;;
esac
ok "$(t "Dépôt configuré" "Repository configured")"

# ---------------------------------------------------------------- bilan
printf '\n%s%s  %s%s\n\n' "$BOLD" "$GREEN" "$(t "Terminé : dépôt Bobine protégé par Tor" "Done: Bobine repository protected by Tor")" "$RESET"
printf '  %s%s%s  %s\n' "$BOLD" "$(t "Canal          :" "Channel        :")" "$RESET" "$CHANNEL ($FAMILY)"
printf '  %s%s%s  %s\n' "$BOLD" "$(t "Installer      :" "Install        :")" "$RESET" "$INSTALL"
printf '  %s%s%s  %s\n' "$BOLD" "$(t "Mettre à jour  :" "Update         :")" "$RESET" "$UPDATE"
printf '  %s%s%s  %s\n\n' "$BOLD" "$(t "Retirer        :" "Remove         :")" "$RESET" "sudo rm $LIST_DEST"
printf '%s  %s%s\n\n' "$DIM" "$(t "Soutenez le projet Tor : https://www.torproject.org/" "Support the Tor project: https://www.torproject.org/")" "$RESET"
