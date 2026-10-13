# Site de divulgation security.bobine.fit

Site statique de divulgation de vulnérabilités de [Bobine](https://github.com/FantasmaGlad/Bobine), servi par GitHub Pages sur <https://security.bobine.fit>. Il est publié depuis ce dossier par la chaîne de déploiement du dépôt (`.github/workflows/deploy.yml`).

Il publie la clé OpenPGP de réception des rapports, son empreinte, une copie du `security.txt` signé et un renvoi vers la politique complète. C'est un canal de vérification de l'empreinte indépendant du site `bobine.fit` : il est hébergé par GitHub Pages et non par l'hébergeur du site.

English: static vulnerability-disclosure site of Bobine, served by GitHub Pages at <https://security.bobine.fit> from `security/site/` by the repository's deployment pipeline. It is a fingerprint-verification channel independent from the main website.

| Fichier de `site/` | Rôle |
|---|---|
| `index.html`, `fr/index.html` | page d'accueil en anglais (défaut) et en français |
| `snake/index.html` | jeu Snake |
| `security.asc` | clé publique OpenPGP (empreinte `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`) |
| `.well-known/security.txt` | copie du fichier signé ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)), identique à celle de `bobine.fit` |
| `CNAME`, `.nojekyll` | domaine personnalisé ; `.nojekyll` garde le dossier `.well-known` servi |
| `robots.txt`, `sitemap.xml`, `llms.txt` | indexation |

## Maintenance

- La clé, son empreinte et `security.txt` doivent rester identiques à ceux de `public/.well-known/` et du dépôt Bobine (`docs/security/`). `scripts/ci/check-security-site.sh` le vérifie à chaque modification.
- `security.txt` est signé : ne jamais l'éditer à la main, et ne jamais laisser un outil convertir ses fins de ligne (`.gitattributes` l'interdit). Le renouveler avec `scripts/security-txt/sign.sh`.
- Les pages sont du HTML écrit à la main : les modifier directement.
- Une surveillance quotidienne (`.github/workflows/security-site-watch.yml`) vérifie que le domaine pointe vers GitHub Pages, que l'empreinte servie est la bonne et que `security.txt` n'expire pas dans moins de 30 jours.
