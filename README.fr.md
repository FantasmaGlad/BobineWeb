# bobine.fit

Site web officiel de **Bobine**, système de régie vidéo libre, autonome et hors-ligne pour salles de sport, studios de cycling et cinémas associatifs : vitrine, documentation, comparatifs, guide matériel et assistant Baamix.

[![Déploiement](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml)
![Licence: lecture seule](https://img.shields.io/badge/Licence-lecture%20seule-lightgrey)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)

English: [README.md](README.md).

| Propriété | URL / Dépôt | Rôle |
| :--- | :--- | :--- |
| **Site Principal** | <https://bobine.fit> | Vitrine, téléchargements, documentation, guide matériel, blog |
| **Miroir Tor (.onion)** | [bobinedaoki….onion](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) | Miroir souverain en service onion et dépôt APT anonyme |
| **Portail Paquets Linux** | <https://packages.bobine.fit> | Dépôts officiels signés APT, DNF et Pacman |
| **Portail Sécurité** | <https://security.bobine.fit> | Politique RFC 9116 et clé OpenPGP officielle |
| **Logiciel Bobine** | [FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine) | Code source du moteur de régie (V5.0.7, AGPL-3.0) |

---

## Architecture & Constellation

Conçu avec **Next.js 16** (App Router, Turbopack), **React 19** et **TypeScript**, partageant un système de design Apple-grade à 15 thèmes (8 thèmes clairs dont la palette *Charbon*, 7 thèmes sombres à haut contraste) à travers les quatre propriétés web :

- **Bilinguisme Strict** : Toutes les pages sont servies en français (`/fr/`) et en anglais (`/en/`) depuis des sources de contenu typées (`src/content/`).
- **Dépôts Linux Dédiés** : Distributions signées pour Debian/Ubuntu, Fedora et Arch Linux (`packages.bobine.fit`).
- **Validation Automatisée** : Intégration continue validant la conformité des dépôts, les contrastes d'accessibilité (`glass-check.mjs`), les logos officiels et les signatures cryptographiques.

---

## Développement Local

```bash
npm ci
cp .env.example .env.local   # facultatif : fonctionne sans aucune clé externe
npm run dev                  # http://localhost:3000
```

---

## Sécurité & Licence

- **Sécurité** : Signalez les vulnérabilités en privé à [security@bobine.fit](mailto:security@bobine.fit) (clé OpenPGP `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`, détails sur [security.bobine.fit](https://security.bobine.fit) et [SECURITY.md](SECURITY.md)).
- **Licence** : Copyright (c) 2026 Bobine. Tous droits réservés. Le code source du site web est publié pour consultation uniquement. Voir [LICENSE](LICENSE) et [NOTICE.md](NOTICE.md). Le logiciel Bobine est un projet distinct sous licence [GNU AGPL-3.0](https://github.com/FantasmaGlad/Bobine/blob/main/LICENSE).
- **Contribuer** : ce dépôt n'accepte pas de contribution ; voir [CONTRIBUTING.md](docs/fr/CONTRIBUTING.md) et [code de conduite](docs/fr/CODE_OF_CONDUCT.md), qui renvoient vers le dépôt Bobine.

## Télécharger Bobine

| Plateforme | Obtenir |
| :--- | :--- |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/windows.svg" width="20" height="20" valign="middle" alt="Windows"> **Windows** x64, ARM64 | [Installeur](https://github.com/FantasmaGlad/Bobine/releases/latest) · [PowerShell](https://github.com/FantasmaGlad/Bobine/blob/main/README.fr.md#installation-en-une-commande) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/apple.svg" width="20" height="20" valign="middle" alt="macOS"> **macOS** Apple Silicon | [.dmg](https://github.com/FantasmaGlad/Bobine/releases/latest) · [Homebrew](https://github.com/FantasmaGlad/homebrew-bobine) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/linux.svg" width="20" height="20" valign="middle" alt="Linux"> **Linux** Debian, Fedora, Arch | [Dépôts signés](https://packages.bobine.fit) · [.deb, .rpm, .pkg](https://github.com/FantasmaGlad/Bobine/releases/latest) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/android.svg" width="20" height="20" valign="middle" alt="Android"> **Android, Android TV** | [APK](https://github.com/FantasmaGlad/Bobine/releases/latest) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Images/bash.svg" width="20" height="20" valign="middle" alt="Mini PC"> **Mini PC** Debian 13 | [install.sh](https://bobine.fit/install.sh) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/tor.svg" width="20" height="20" valign="middle" alt="Tor"> **Tor** | [Site](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) · [Paquets](http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/) · [install-tor.sh](https://bobine.fit/install-tor.sh) |

Tous les canaux (Stable, Bêta, Canary) et les commandes en une ligne, y compris par Tor : [README de Bobine](https://github.com/FantasmaGlad/Bobine/blob/main/README.fr.md#téléchargement--installation).

<sub>Dépôts liés : [Bobine](https://github.com/FantasmaGlad/Bobine) (application) · [bobine-packages](https://github.com/FantasmaGlad/bobine-packages) (dépôts de paquets Linux) · [homebrew-bobine](https://github.com/FantasmaGlad/homebrew-bobine) (tap Homebrew) · Politique de sécurité : [security.bobine.fit](https://security.bobine.fit/fr/), [`/.well-known/security.txt`](https://bobine.fit/.well-known/security.txt)</sub>
