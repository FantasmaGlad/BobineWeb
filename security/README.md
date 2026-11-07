# security.bobine.fit

Site statique de divulgation responsable, noir sur blanc et sans script : politique, clé OpenPGP et `/.well-known/security.txt` (RFC 9116). Publié sur GitHub Pages par le job `deploy-security` de `.github/workflows/deploy.yml`.

## Commandes

```bash
node scripts/security-site/build.mjs        # générer les pages (contenu dans le script, style dans scripts/security-site/site.css)
bash scripts/ci/check-security-site.sh      # signature, empreinte, expirations, liens
bash scripts/security-txt/sign.sh           # renouveler et signer security.txt
```

Aperçu local : `python3 -m http.server 3104 --bind 127.0.0.1 --directory security/site`.

## Clé

- `https://security.bobine.fit/security.asc` (Ed25519)
- Empreinte : `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`
- La CI exige 30 jours de validité restante pour `security.txt` et 90 jours pour la clé.
