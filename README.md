# bobine.fit

The official website of **Bobine**, an open-source, self-hosted and offline-first video playout system for gyms, cycling studios and fitness clubs: showcase and documentation.

[![Deployment](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml)
![License: view only](https://img.shields.io/badge/License-view%20only-lightgrey)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)

Français : [README.fr.md](README.fr.md).

| Property | URL / Repository | Purpose |
| :--- | :--- | :--- |
| **Main Website** | <https://bobine.fit> | Showcase, download hub, docs, hardware guides, blog |
| **Tor Mirror (.onion)** | [bobinedaoki….onion](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) | Sovereign `.onion` site mirror & anonymous APT repository |
| **Linux Package Portal** | <https://packages.bobine.fit> | GPG-signed APT, DNF, and Pacman repositories |
| **Security Portal** | <https://security.bobine.fit> | RFC 9116 security policy & verified OpenPGP key |
| **Bobine Software** | [FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine) | Playout engine source code (V5.0.7, AGPL-3.0) |

---

## Architecture & Constellation

Built with **Next.js 16** (App Router, Turbopack), **React 19**, and **TypeScript**, sharing a design system of 9 palettes, each in light and dark mode, across all four web properties:

- **Bilingual Source of Truth**: All pages served in French (`/fr/`) and English (`/en/`) from typed content definitions (`src/content/`).
- **Independent Linux Repositories**: Continuous signed distributions for Debian/Ubuntu, Fedora, and Arch Linux (`packages.bobine.fit`).
- **Automated Verification**: Strict CI validating policy compliance, contrast ratios (`glass-check.mjs`), vector brand icons, and security signatures.

---

## Local Development

```bash
npm ci
cp .env.example .env.local   # optional: runs with zero external keys
npm run dev                  # http://localhost:3000
```

---

## Security & License

- **Security**: Report vulnerabilities privately via [security@bobine.fit](mailto:security@bobine.fit) (OpenPGP key `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`, details on [security.bobine.fit](https://security.bobine.fit) and [SECURITY.md](SECURITY.md)).
- **License**: Copyright (c) 2026 Bobine. All rights reserved. The website source is published for reading only. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md). The Bobine software itself is licensed under the [GNU AGPL-3.0](https://github.com/FantasmaGlad/Bobine/blob/main/LICENSE).
- **Contributing**: this repository does not accept contributions; see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), which point to the Bobine repository.

## Download Bobine

| Platform | Get it |
| :--- | :--- |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/windows.svg" width="20" height="20" valign="middle" alt="Windows"> **Windows** x64, ARM64 | [Installer](https://github.com/FantasmaGlad/Bobine/releases/latest) · [PowerShell](https://github.com/FantasmaGlad/Bobine#one-command-install) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/apple.svg" width="20" height="20" valign="middle" alt="macOS"> **macOS** Apple Silicon | [.dmg](https://github.com/FantasmaGlad/Bobine/releases/latest) · [Homebrew](https://github.com/FantasmaGlad/homebrew-bobine) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/linux.svg" width="20" height="20" valign="middle" alt="Linux"> **Linux** Debian, Fedora, Arch | [Signed repositories](https://packages.bobine.fit) · [.deb, .rpm, .pkg](https://github.com/FantasmaGlad/Bobine/releases/latest) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/android.svg" width="20" height="20" valign="middle" alt="Android"> **Android, Android TV** | [APK](https://github.com/FantasmaGlad/Bobine/releases/latest) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Images/bash.svg" width="20" height="20" valign="middle" alt="Mini PC"> **Mini PC** Debian 13 | [install.sh](https://bobine.fit/install.sh) |
| <img src="https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/Assets/Icons/os/tor.svg" width="20" height="20" valign="middle" alt="Tor"> **Tor** | [Website](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) · [Packages](http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/) · [install-tor.sh](https://bobine.fit/install-tor.sh) |

All channels (Stable, Beta, Canary) and one-line commands, including through Tor: [Bobine README](https://github.com/FantasmaGlad/Bobine#download--install).

<sub>Related repositories: [Bobine](https://github.com/FantasmaGlad/Bobine) (application) · [bobine-packages](https://github.com/FantasmaGlad/bobine-packages) (Linux package repositories) · [homebrew-bobine](https://github.com/FantasmaGlad/homebrew-bobine) (Homebrew tap) · Security policy: [security.bobine.fit](https://security.bobine.fit), [`/.well-known/security.txt`](https://bobine.fit/.well-known/security.txt)</sub>
