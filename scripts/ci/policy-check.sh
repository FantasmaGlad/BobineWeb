#!/usr/bin/env bash
# Contrôles de politique du dépôt : entrées autorisées, secrets, emoji, identité des commits.
# Variables : POLICY_RANGE (ex. "avant..apres") active les contrôles de commits.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

fail=0
err() { echo "::error::$*"; fail=1; }

# 1. Entrées cachées à la racine : seule une liste fermée est publiée.
while IFS= read -r top; do
  case "$top" in
    .github|.gitignore|.gitattributes|.env.example) ;;
    .*) err "Entrée cachée non autorisée à la racine : $top" ;;
  esac
done < <(git ls-files | cut -d/ -f1 | sort -u)

# 2. Fichiers Markdown de la racine : liste fermée.
while IFS= read -r f; do
  case "$f" in
    README.md|README.fr.md|CONTRIBUTING.md|CODE_OF_CONDUCT.md|SECURITY.md|NOTICE.md) ;;
    *) err "Fichier Markdown non autorisé à la racine : $f" ;;
  esac
done < <(git ls-files | grep -E '^[^/]+\.md$' || true)

# 3. Fichiers qui ne doivent jamais être suivis : variables d'environnement, clés, archives, sauvegardes.
forbidden='(^|/)(\.env(\..*)?|id_(rsa|ed25519|ecdsa)[^/]*|hs_ed25519_[^/]*|[^/]*\.(pem|key|p12|pfx|jks|keystore|bundle|tar|tgz|tar\.gz|gpg|kdbx))$'
if git ls-files | grep -E "$forbidden" | grep -vE '(^|/)\.env\.example$' | grep .; then
  err "Fichier sensible suivi par Git (liste ci-dessus)"
fi

# 4. Secrets : motifs connus dans les fichiers texte suivis.
excl=(':!package-lock.json' ':!public/sw.js' ':!scripts/ci/policy-check.sh')
secret='sk-or-v1-[0-9a-f]{20,}|sk-[A-Za-z0-9]{32,}|hf_[A-Za-z0-9]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN ([A-Z]+ )?PRIVATE KEY'
if git grep -InE "$secret" -- . "${excl[@]}"; then
  err "Secret probable dans un fichier suivi (liste ci-dessus)"
fi

# 5. Aucun emoji (les symboles typographiques comme les coches restent permis).
if LC_ALL=C.UTF-8 git grep -InP '[\x{1F000}-\x{1FAFF}]' -- . "${excl[@]}"; then
  err "Emoji trouvé (liste ci-dessus) : utiliser une icône SVG filaire ou de la typographie"
fi

# 6. Commits poussés : aucun trailer de co-auteur, identité noreply.
if [ -n "${POLICY_RANGE:-}" ]; then
  if git log --format='%B' "$POLICY_RANGE" | grep -iE '^co-authored-by:'; then
    err "Trailer de co-auteur interdit dans un commit"
  fi
  bad=$(git log --format='%h %ae %ce' "$POLICY_RANGE" | grep -vE '@users\.noreply\.github\.com.*@users\.noreply\.github\.com|noreply@github\.com' || true)
  if [ -n "$bad" ]; then
    echo "$bad"
    err "Adresse d'auteur ou de committer qui n'est pas une adresse noreply GitHub"
  fi
fi

if [ "$fail" -ne 0 ]; then
  exit 1
fi
echo "Politique du dépôt respectée."
