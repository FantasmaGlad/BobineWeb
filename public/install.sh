#!/usr/bin/env bash
#
# Bobine — Script d'installation rapide & bootstrap
# Usage :
#   curl -sSL https://bobine.fit/install.sh | bash
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --verbose
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --no-kiosk
#
set -euo pipefail

BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${BOLD}${CYAN}==> Initialisation de l'installateur Bobine...${RESET}"

# 1. Détection si on est déjà positionné dans un dossier Bobine local
if [[ -f "install.sh" && -d "backend" && -d "frontend" ]]; then
    echo -e "${GREEN}==> Dépôt Bobine local détecté dans le répertoire courant : $(pwd)${RESET}"
    if [[ -d ".git" ]]; then
        echo "==> Vérification des mises à jour depuis GitHub..."
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

# Si un clone existe déjà dans Developpement/web/Bobine, on le prend en compte s'il existe
if [[ ! -d "${TARGET_DIR}" && -d "$HOME/Developpement/web/Bobine" ]]; then
    TARGET_DIR="$HOME/Developpement/web/Bobine"
fi

echo "==> Dossier cible : ${TARGET_DIR}"

# 3. Vérification / installation des prérequis minimaux (git, curl, ca-certificates)
if ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
    echo "==> Installation des outils système préalables (git, curl, ca-certificates)..."
    if [[ $EUID -eq 0 ]]; then
        apt-get update -qq && apt-get install -y -qq git curl ca-certificates
    elif command -v sudo >/dev/null 2>&1; then
        sudo apt-get update -qq && sudo apt-get install -y -qq git curl ca-certificates
    else
        echo -e "${YELLOW}Avertissement : 'git' et 'curl' sont requis. Installez-les via 'apt install git curl ca-certificates'.${RESET}" >&2
        exit 1
    fi
fi

# 4. Gestion intelligente du dépôt cible
if [[ -d "${TARGET_DIR}/.git" ]]; then
    echo -e "${GREEN}==> Dépôt Git Bobine existant détecté : ${TARGET_DIR}${RESET}"
    LOCAL_VER="$(git -C "${TARGET_DIR}" describe --tags --always 2>/dev/null || git -C "${TARGET_DIR}" rev-parse --short HEAD 2>/dev/null || echo "actuelle")"
    echo "==> Version locale : ${LOCAL_VER}"
    echo "==> Recherche de mises à jour sur GitHub..."
    git -C "${TARGET_DIR}" fetch origin --tags -q 2>/dev/null || git -C "${TARGET_DIR}" fetch origin -q 2>/dev/null || true
    REMOTE_VER="$(git -C "${TARGET_DIR}" rev-parse --short origin/main 2>/dev/null || echo "inconnue")"
    
    if git -C "${TARGET_DIR}" pull --ff-only 2>/dev/null; then
        NEW_VER="$(git -C "${TARGET_DIR}" describe --tags --always 2>/dev/null || git -C "${TARGET_DIR}" rev-parse --short HEAD 2>/dev/null || echo "$LOCAL_VER")"
        echo -e "${GREEN}==> Dépôt synchronisé avec succès (${NEW_VER}).${RESET}"
    else
        echo -e "${YELLOW}==> Modifications locales détectées ou branche divergente : conservation de l'état local.${RESET}"
    fi
elif [[ -d "${TARGET_DIR}" && -f "${TARGET_DIR}/install.sh" && -d "${TARGET_DIR}/backend" ]]; then
    echo -e "${GREEN}==> Répertoire Bobine existant détecté (sans git) : utilisation des sources présentes.${RESET}"
elif [[ -d "${TARGET_DIR}" && "$(ls -A "${TARGET_DIR}" 2>/dev/null)" ]]; then
    echo -e "${YELLOW}==> Le dossier ${TARGET_DIR} existe et n'est pas un dépôt Bobine.${RESET}"
    BACKUP_DIR="${TARGET_DIR}.backup_$(date +%Y%m%d_%H%M%S)"
    echo "==> Déplacement vers ${BACKUP_DIR}..."
    mv "${TARGET_DIR}" "${BACKUP_DIR}"
    echo "==> Clonage du dépôt Bobine officiel depuis GitHub..."
    git clone https://github.com/FantasmaGlad/Bobine.git "${TARGET_DIR}"
else
    echo "==> Clonage du dépôt Bobine officiel depuis GitHub..."
    git clone https://github.com/FantasmaGlad/Bobine.git "${TARGET_DIR}"
fi

cd "${TARGET_DIR}"
chmod +x ./install.sh

# 5. Exécution de l'installateur tout-en-un
if [[ $EUID -ne 0 ]]; then
    if command -v sudo >/dev/null 2>&1; then
        exec sudo ./install.sh "$@"
    else
        echo "Exécution en root via su..."
        exec su - -c "$PWD/install.sh $*"
    fi
else
    exec ./install.sh "$@"
fi
