#!/usr/bin/env bash
#
# Bobine — Script d'installation rapide & bootstrap
# Usage :
#   curl -sSL https://bobine.fit/install.sh | bash
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --verbose
#   curl -sSL https://bobine.fit/install.sh | bash -s -- --no-kiosk
#
set -euo pipefail

# 1. Détection si on est déjà dans un dépôt Bobine local
if [[ -f "install.sh" && -d "backend" && -d "frontend" ]]; then
    echo "==> Dépôt Bobine local détecté ($(pwd))."
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

# 2. Installation sur une machine neuve ou hors dépôt
TARGET_DIR="${BOBINE_DIR:-$HOME/Bobine}"
echo "==> Préparation de l'installation de Bobine..."
echo "==> Dossier cible : ${TARGET_DIR}"

# Vérification / installation des prérequis minimaux (git, curl, ca-certificates)
if ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
    echo "==> Installation des outils système préalables (git, curl, ca-certificates)..."
    if [[ $EUID -eq 0 ]]; then
        apt-get update -qq && apt-get install -y -qq git curl ca-certificates
    elif command -v sudo >/dev/null 2>&1; then
        sudo apt-get update -qq && sudo apt-get install -y -qq git curl ca-certificates
    else
        echo "Erreur : 'git' et 'curl' sont requis. Installez-les via 'apt install git curl ca-certificates'." >&2
        exit 1
    fi
fi

# Clonage ou mise à jour du dépôt officiel
if [[ -d "${TARGET_DIR}/.git" ]]; then
    echo "==> Dépôt Bobine existant détecté : mise à jour..."
    git -C "${TARGET_DIR}" pull --ff-only || true
else
    echo "==> Clonage du dépôt Bobine depuis GitHub..."
    git clone https://github.com/FantasmaGlad/Bobine.git "${TARGET_DIR}"
fi

cd "${TARGET_DIR}"
chmod +x ./install.sh

# Exécution de l'installateur tout-en-un
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
