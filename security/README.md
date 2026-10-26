# Site de divulgation de vulnérabilités

`security/site` est le résultat statique publié sur `security.bobine.fit` par le workflow de déploiement. Les pages françaises et anglaises, le jeu Snake, les styles et les scripts proviennent de `scripts/security-site`.

```sh
node scripts/security-site/build.mjs
bash scripts/ci/check-security-site.sh
```

Le générateur reprend les jetons et les sélecteurs exportés du site principal (`public/bobine-tokens.css`, `bobine-controls.css` et `bobine-themes.json`). Il ne touche pas à la clé OpenPGP, au fichier signé `.well-known/security.txt`, au domaine `CNAME` ni à `.nojekyll`. Les renouvellements cryptographiques suivent les scripts dédiés dans `scripts/security-txt`.

La CI refuse les ressources générées périmées, les liens locaux cassés et les scripts ou styles intégrés aux pages, à l'exception des métadonnées JSON-LD. Elle vérifie également la signature, l'empreinte et les expirations. Le contrôle de géométrie couvre les quatre pages, les petits écrans en portrait et paysage, le menu et les 16 thèmes.

Pour vérifier le rendu local :

```sh
python3 -m http.server 3104 --bind 127.0.0.1 --directory security/site
# Dans un autre terminal :
node scripts/ci/check-security-menu.mjs
```

Après publication, `scripts/ci/smoke-security.sh` compare les ressources et les documents cryptographiques servis aux fichiers du dépôt. La surveillance quotidienne vérifie aussi le domaine, les différentes copies de la clé et les expirations. Les adresses de contact sont publiées en clair pour permettre la découverte WKD et la copie directe.
