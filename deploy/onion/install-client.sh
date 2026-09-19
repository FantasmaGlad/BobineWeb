#!/usr/bin/env bash
#
# install-tor.sh — Bobine : dépôt APT protégé via Tor (service onion)
#
# Installe apt-transport-tor, récupère la clé de signature de Bobine (par Tor, sans contacter le web
# classique), vérifie son empreinte contre celle publiée, puis ajoute la source APT en .onion.
# À LIRE AVANT de l'exécuter. Il s'arrête si l'empreinte de la clé diffère.
#
#   curl -fsSL https://bobine.fit/install-tor.sh | bash
#   curl -fsSL https://bobine.fit/install-tor.sh | bash -s -- --dry-run     # ne modifie rien
#
# Options : --dry-run   simule (télécharge et vérifie la clé, n'installe rien)
#           --lang=en   messages en anglais
#           --clearnet-key   récupère la clé sur https://apt.bobine.fit (révèle votre IP à ce serveur)
#
set -euo pipefail

APT_ONION="rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
PRIMARY_FPR="B77D96D72F84F36ACAA3F8729CBF497D829EE15A"
KEY_DEST="/etc/apt/keyrings/bobine.gpg"
LIST_DEST="/etc/apt/sources.list.d/bobine-onion.list"
TOTAL=5

DRY_RUN=0; CLEARNET_KEY=0; LANG_OUT="fr"
[[ "${LANG:-}" == en* ]] && LANG_OUT="en"
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=1 ;;
        --lang=en) LANG_OUT="en" ;;
        --lang=fr) LANG_OUT="fr" ;;
        --clearnet-key) CLEARNET_KEY=1 ;;
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

ICON_OK="${GREEN}✓${RESET}"
ICON_FAIL="${RED}✗${RESET}"
ICON_INFO="${PURPLE}→${RESET}"

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
    printf '\n%s%s  %s%s\n' "$BOLD" "$PURPLE" "$(t "Dépôt APT protégé via Tor (service onion)" "APT repository protected through Tor (onion service)")" "$RESET"
    printf '%s  %s%s\n' "$DIM" "$(t "Mêmes paquets, même signature, sans révéler votre adresse IP." "Same packages, same signature, without revealing your IP address.")" "$RESET"
    printf '%s  tor+http://%s%s\n\n' "$DIM" "$APT_ONION" "$RESET"
}

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
(( DRY_RUN )) && info "$(t "Mode simulation : rien ne sera installé ni modifié." "Dry-run mode: nothing will be installed or changed.")" && echo

# ---------------------------------------------------------------- 1. environnement
step "$(t "Vérification de l'environnement" "Checking the environment")"
command -v apt-get >/dev/null 2>&1 || die "$(t "apt-get introuvable : ce script vise Debian, Ubuntu et dérivés." "apt-get not found: this script targets Debian, Ubuntu and derivatives.")"
command -v curl >/dev/null 2>&1 || die "$(t "curl est requis (sudo apt install curl)." "curl is required (sudo apt install curl).")"
command -v gpg >/dev/null 2>&1 || die "$(t "gpg est requis (sudo apt install gnupg)." "gpg is required (sudo apt install gnupg).")"
ok "$(t "Système compatible (apt, curl, gpg)" "Compatible system (apt, curl, gpg)")"

# ---------------------------------------------------------------- 2. apt-transport-tor
step "$(t "Paquet apt-transport-tor" "apt-transport-tor package")"
if dpkg -s apt-transport-tor >/dev/null 2>&1; then
    ok "$(t "Déjà installé" "Already installed")"
elif (( DRY_RUN )); then
    info "${DIM}[dry-run] sudo apt-get install apt-transport-tor${RESET}"
else
    sudo apt-get install -y -qq apt-transport-tor >"$TMP/apt-install.log" 2>&1 \
        || { cat "$TMP/apt-install.log" >&2; die "$(t "Installation de apt-transport-tor impossible" "Could not install apt-transport-tor")"; }
    ok "$(t "apt-transport-tor installé (Tor et le proxy SOCKS local inclus)" "apt-transport-tor installed (Tor and the local SOCKS proxy included)")"
fi

# ---------------------------------------------------------------- 3. clé de signature
step "$(t "Clé de signature de Bobine" "Bobine signing key")"
KEY_FILE="$TMP/bobine.gpg"
if (( CLEARNET_KEY )); then
    curl -fsSL https://apt.bobine.fit/bobine.gpg -o "$KEY_FILE" || die "$(t "Téléchargement de la clé impossible" "Could not download the key")"
    ok "$(t "Clé téléchargée depuis apt.bobine.fit (web classique)" "Key downloaded from apt.bobine.fit (regular web)")"
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

# ---------------------------------------------------------------- 5. source APT
step "$(t "Source APT via Tor" "APT source through Tor")"
if [[ -s "$KEY_FILE" ]]; then
    run sudo install -d -m 755 /etc/apt/keyrings
    if (( DRY_RUN )); then info "${DIM}[dry-run] gpg --dearmor -> $KEY_DEST${RESET}"; else sudo gpg --yes --dearmor -o "$KEY_DEST" "$KEY_FILE"; fi
fi
LINE="deb [signed-by=${KEY_DEST}] tor+http://${APT_ONION}/ stable main"
if (( DRY_RUN )); then info "${DIM}[dry-run] $LINE${RESET}"; else printf '%s\n' "$LINE" | sudo tee "$LIST_DEST" >/dev/null; fi
if (( DRY_RUN )); then
    ok "$(t "Simulation terminée" "Dry-run complete")"
else
    run sudo apt-get update >"$TMP/apt-update.log" 2>&1 || { cat "$TMP/apt-update.log" >&2; die "$(t "apt update a échoué" "apt update failed")"; }
    ok "$(t "Index récupéré par Tor et signature validée" "Index fetched through Tor and signature validated")"
fi

# ---------------------------------------------------------------- bilan
printf '\n%s%s  %s%s\n\n' "$BOLD" "$GREEN" "$(t "Terminé : dépôt Bobine protégé par Tor" "Done: Bobine repository protected by Tor")" "$RESET"
printf '  %s%s%s  sudo apt install bobine\n' "$BOLD" "$(t "Installer      :" "Install        :")" "$RESET"
printf '  %s%s%s  sudo apt update && sudo apt upgrade\n' "$BOLD" "$(t "Mettre à jour  :" "Update         :")" "$RESET"
printf '  %s%s%s  %s\n\n' "$BOLD" "$(t "Retirer        :" "Remove         :")" "$RESET" "sudo rm $LIST_DEST"
printf '%s  %s%s\n\n' "$DIM" "$(t "Soutenez le projet Tor : https://www.torproject.org/" "Support the Tor project: https://www.torproject.org/")" "$RESET"
