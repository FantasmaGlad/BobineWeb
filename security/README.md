# Portail de Sécurité & Divulgation de Vulnérabilités (security.bobine.fit)

`security/site` est le portail statique SSG publié sur `https://security.bobine.fit` par le workflow de déploiement GitHub Pages. Il rassemble la politique officielle de divulgation responsable (*Responsible Disclosure Policy*), la clé publique OpenPGP, le fichier standardisé RFC 9116, ainsi que le mini-jeu historique Snake.

## 1. Architecture & Stack Technique

- **Architecture hybride & SSG** : compilée avec Next.js 16, React 19 et TypeScript (`output: 'export'`) et script de synchronisation `scripts/security-site/build.mjs` garantissant zéro script inline hors JSON-LD.
- **Zéro dépendance d'exécution** : aucune feuille de style ni script tiers en ligne ; les métadonnées JSON-LD sont les seuls blocs intégrés autorisés.
- **Design System Bobine** : jetons Liquid Glass (`bobine-tokens.css`), sélecteurs partagés (`bobine-controls.css`), thème Lavande par défaut (`data-theme="lavande"`), et palette de 16 thèmes synchronisée avec le site principal.
- **Ressources préservées** : mini-jeu d'arcade Snake historique (`/snake/` et `/fr/snake/`), clé OpenPGP (`security.asc`), fichier signé `/.well-known/security.txt`, domaine `CNAME` et `.nojekyll`.

## 2. Commandes de Build & Vérification

```bash
# Compilation Next.js SSG (depuis security/site)
npm run build --prefix security/site

# Synchronisation des pages statiques conformes CSP (sans inline script)
node scripts/security-site/build.mjs

# Contrôle statique CI complet (signature, empreinte, expirations, liens locaux)
bash scripts/ci/check-security-site.sh

# Renouvellement et signature OpenPGP (interactif)
bash scripts/security-txt/sign.sh
```

Pour prévisualiser et tester le rendu localement :

```bash
# Lancer le serveur local
python3 -m http.server 3104 --bind 127.0.0.1 --directory security/site

# Dans un autre terminal : tester le menu, les 16 thèmes et Snake sur plusieurs résolutions
node scripts/ci/check-security-menu.mjs
```

## 3. Clé Publique OpenPGP & Conformité RFC 9116

- **Clé de réception des signalements** : `https://security.bobine.fit/security.asc` (Ed25519 / Curve25519).
- **Empreinte cryptographique officielle** :
  ```
  23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2
  ```
- **Fichier `security.txt`** : conforme à la RFC 9116, disponible sous `/.well-known/security.txt` et signé avec la clé officielle.
- **Renouvellement cryptographique** : les scripts de signature et de renouvellement résident dans `scripts/security-txt/sign.sh`. La CI impose au moins 30 jours de validité résiduelle pour `security.txt` et 90 jours pour la clé.

## 4. Déploiement & Surveillance

Le déploiement est automatisé par `.github/workflows/deploy.yml` (job `deploy-security`) qui archive `security/site` sans omettre le dossier caché `.well-known`. Après publication, `scripts/ci/smoke-security.sh` et le workflow quotidien `security-site-watch.yml` contrôlent la cohérence des signatures, les miroirs WKD et la disponibilité du domaine.
