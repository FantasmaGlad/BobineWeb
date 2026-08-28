#!/usr/bin/env bash
#
# Bobine — Script d'installation rapide & bootstrap
# Usage :
#   curl -sSL https://bobine.fit/install.sh | bash
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --verbose
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --no-kiosk
#
set -euo pipefail

# 0. Couleurs et symboles
if [[ -t 1 ]] && [[ "${NO_COLOR:-}" != "1" ]]; then
    BOLD='\033[1m'
    DIM='\033[2m'
    RESET='\033[0m'
    WHITE='\033[1;37m'
    CYAN='\033[38;5;51m'
    BLUE='\033[38;5;75m'
    GREEN='\033[38;5;84m'
    YELLOW='\033[38;5;220m'
    RED='\033[38;5;203m'
else
    BOLD=""
    DIM=""
    RESET=""
    WHITE=""
    CYAN=""
    BLUE=""
    GREEN=""
    YELLOW=""
    RED=""
fi

ICON_OK="${GREEN}✓${RESET}"
ICON_INFO="${CYAN}▸${RESET}"
ICON_WARN="${YELLOW}⚠${RESET}"
ICON_FAIL="${RED}✗${RESET}"

print_banner() {
    local cols
    cols=$(tput cols 2>/dev/null || echo 80)
    
    printf "\n"
    if (( cols >= 115 )); then
        printf "%b" "${WHITE}${BOLD}"
        cat <<'EOF'
   ███████████                                                                
 ███████████████                                                              
 ██  ██   ██  ███                                                             
 ██ █████████ ███                                                             
 █████████████████               ████        ████                             
  █████   █████ ██               ████        ████                             
  █████████████ ██               ████        ████                             
  ████   █████████     ██████    ████████    ████  █████████     ███████    
 ████     ████████   ██████████  █████████   ████  ██████████   █████████   
█████  ██  ██ ████  ████    ████ ████   ████ ████  ████   ████ ████   ████  
██████  ██    ████  ████    ████ ████   ████ ████  ████   ████ ███████████  
███████   ████████  ████    ████ ████   ████ ████  ████   ████ ███████████  
 █████████████████  ████    ████ ████   ████ ████  ████   ████ ████         
  ███████████████    ██████████  ██████████  ████  ████   ████  █████████   
   ███████████         ██████    █████████   ████  ████   ████   ███████    
EOF
        printf "%b" "${RESET}"
    else
        printf "%b  ██████   ██████  ██████  ██ ███   ██ ███████%b\n" "${WHITE}${BOLD}" "${RESET}"
        printf "%b  ██   ██ ██    ██ ██   ██ ██ ████  ██ ██     %b\n" "${WHITE}${BOLD}" "${RESET}"
        printf "%b  ██████  ██    ██ ██████  ██ ██ ██ ██ █████  %b\n" "${WHITE}${BOLD}" "${RESET}"
        printf "%b  ██   ██ ██    ██ ██   ██ ██ ██  ████ ██     %b\n" "${WHITE}${BOLD}" "${RESET}"
        printf "%b  ██████   ██████  ██████  ██ ██   ███ ███████%b\n" "${WHITE}${BOLD}" "${RESET}"
    fi
    printf "%b  Régie Vidéo & Streaming Libre pour Salle de Sport%b\n" "${DIM}" "${RESET}"
    printf "%b  Debian 13 · Dell Wyse 5070 · FastAPI + Next.js%b\n\n" "${DIM}" "${RESET}"
}

print_banner

printf " %s %sInitialisation de l'environnement Bobine...%s\n" "${ICON_INFO}" "${BOLD}" "${RESET}"

# 1. Détection si on est déjà positionné dans un dossier Bobine local
if [[ -f "install.sh" && -d "backend" && -d "frontend" ]]; then
    printf " %s %sDépôt local détecté :%s %s%s%s\n" "${ICON_OK}" "${GREEN}" "${RESET}" "${DIM}" "$(pwd)" "${RESET}"
    if [[ -d ".git" ]]; then
        printf " %s Recherche des mises à jour sur GitHub...\n" "${ICON_INFO}"
        git fetch origin --tags -q 2>/dev/null || true
        git pull --ff-only 2>/dev/null || git pull -q 2>/dev/null || true
    fi
    chmod +x ./install.sh
    if [[ $EUID -ne 0 ]]; then
        if command -v sudo >/dev/null 2>&1; then
            exec sudo ./install.sh "$@"
        else
            exec su - -c "$PWD/install.sh $*"
        fi
    else
        exec ./install.sh "$@"
    fi
fi

# 2. Détermination du dossier cible
TARGET_DIR="${BOBINE_DIR:-$HOME/Bobine}"

if [[ ! -d "${TARGET_DIR}" && -d "$HOME/Developpement/web/Bobine" ]]; then
    TARGET_DIR="$HOME/Developpement/web/Bobine"
fi

printf " %s Dossier cible : %s%s%s\n" "${ICON_INFO}" "${BOLD}" "${TARGET_DIR}" "${RESET}"

# 3. Vérification / installation des prérequis minimaux (git, curl, ca-certificates)
if ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
    printf " %s Installation des outils système préalables (%sgit, curl, ca-certificates%s)...\n" "${ICON_INFO}" "${BOLD}" "${RESET}"
    if [[ $EUID -eq 0 ]]; then
        apt-get update -qq && apt-get install -y -qq git curl ca-certificates
    elif command -v sudo >/dev/null 2>&1; then
        sudo apt-get update -qq && sudo apt-get install -y -qq git curl ca-certificates
    else
        printf " %s %s'git' et 'curl' sont requis. Installez-les via 'apt install git curl ca-certificates'.%s\n" "${ICON_WARN}" "${YELLOW}" "${RESET}" >&2
        exit 1
    fi
fi

# 4. Gestion intelligente du dépôt cible
if [[ -d "${TARGET_DIR}/.git" ]]; then
    printf " %s %sDépôt Git existant détecté :%s %s\n" "${ICON_OK}" "${GREEN}" "${RESET}" "${TARGET_DIR}"
    LOCAL_VER="$(git -C "${TARGET_DIR}" describe --tags --always 2>/dev/null || git -C "${TARGET_DIR}" rev-parse --short HEAD 2>/dev/null || echo "actuelle")"
    printf " %s Version locale : %s%s%s\n" "${ICON_INFO}" "${CYAN}" "${LOCAL_VER}" "${RESET}"
    printf " %s Synchronisation avec GitHub...\n" "${ICON_INFO}"
    git -C "${TARGET_DIR}" fetch origin --tags -q 2>/dev/null || git -C "${TARGET_DIR}" fetch origin -q 2>/dev/null || true
    
    if git -C "${TARGET_DIR}" pull --ff-only 2>/dev/null; then
        NEW_VER="$(git -C "${TARGET_DIR}" describe --tags --always 2>/dev/null || git -C "${TARGET_DIR}" rev-parse --short HEAD 2>/dev/null || echo "$LOCAL_VER")"
        printf " %s %sDépôt synchronisé (%s)%s\n" "${ICON_OK}" "${GREEN}" "${NEW_VER}" "${RESET}"
    else
        printf " %s %sModifications locales détectées : conservation de l'état local.%s\n" "${ICON_WARN}" "${YELLOW}" "${RESET}"
    fi
elif [[ -d "${TARGET_DIR}" && -f "${TARGET_DIR}/install.sh" && -d "${TARGET_DIR}/backend" ]]; then
    printf " %s Répertoire Bobine existant détecté (sans git) : utilisation des sources présentes.\n" "${ICON_OK}"
elif [[ -d "${TARGET_DIR}" && "$(ls -A "${TARGET_DIR}" 2>/dev/null)" ]]; then
    BACKUP_DIR="${TARGET_DIR}.backup_$(date +%Y%m%d_%H%M%S)"
    printf " %s Le dossier %s existe déjà : sauvegarde vers %s\n" "${ICON_WARN}" "${TARGET_DIR}" "${BACKUP_DIR}"
    mv "${TARGET_DIR}" "${BACKUP_DIR}"
    printf " %s Clonage du dépôt Bobine officiel...\n" "${ICON_INFO}"
    git clone https://github.com/FantasmaGlad/Bobine.git "${TARGET_DIR}"
else
    printf " %s Clonage du dépôt Bobine officiel depuis GitHub...\n" "${ICON_INFO}"
    git clone https://github.com/FantasmaGlad/Bobine.git "${TARGET_DIR}"
fi

cd "${TARGET_DIR}"
chmod +x ./install.sh

# 5. Exécution de l'installateur tout-en-un
printf " %s %sLancement de l'installateur Bobine...%s\n\n" "${ICON_INFO}" "${BOLD}" "${RESET}"

if [[ $EUID -ne 0 ]]; then
    if command -v sudo >/dev/null 2>&1; then
        exec sudo ./install.sh "$@"
    else
        printf " %s Exécution en root via su...\n" "${ICON_INFO}"
        exec su - -c "$PWD/install.sh $*"
    fi
else
    exec ./install.sh "$@"
fi
