#!/usr/bin/env bash
# Les instructions actives utilisent le dépôt unifié, jamais ses anciens alias.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
if grep -rnE '(apt|rpm|arch)\.bobine\.fit' src public; then
  echo '::error::Hôte de paquets périmé : utiliser packages.bobine.fit et le chemin de sa famille.'
  exit 1
fi
echo 'Hôtes de paquets conformes.'
