#!/usr/bin/env bash
# Installe la source APT de Bobine en service onion (Tor). A LIRE avant de l'executer :
# il installe apt-transport-tor, telecharge la cle de signature et ajoute la source.
# La cle est verifiee contre l'empreinte publiee ; le script s'arrete si elle differe.
set -euo pipefail

APT_ONION="rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion"
PRIMARY_FPR="B77D96D72F84F36ACAA3F8729CBF497D829EE15A"

sudo apt-get install -y apt-transport-tor gnupg curl
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
curl -fsSL https://apt.bobine.fit/bobine.gpg -o "$tmp"

got=$(gpg --show-keys --with-colons "$tmp" | awk -F: '/^fpr:/ {print $10; exit}')
[ "$got" = "$PRIMARY_FPR" ] || { echo "Empreinte inattendue : $got" >&2; exit 1; }

sudo install -d -m 755 /etc/apt/keyrings
sudo gpg --yes --dearmor -o /etc/apt/keyrings/bobine.gpg "$tmp"
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://${APT_ONION}/ stable main" \
  | sudo tee /etc/apt/sources.list.d/bobine-onion.list >/dev/null
sudo apt-get update && echo "Pret : sudo apt install bobine"
