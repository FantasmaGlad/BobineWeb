# bobine.fit

<p align="center">
  <img alt="Bobine" src="public/images/LogoBanniere.png" width="100%">
</p>

The website of **Bobine**, an open-source, self-hosted and offline-first video playout system for gyms, cycling studios and fitness clubs: showcase, documentation, comparisons, hardware shop and the Baamix assistant.

[![Deployment](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/FantasmaGlad/BobineWeb/actions/workflows/codeql.yml)
![License: view only](https://img.shields.io/badge/License-view%20only-lightgrey)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)

Français : [README.fr.md](README.fr.md).

| | |
|---|---|
| Website | <https://bobine.fit> |
| Tor mirror | `http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/` |
| APT repository | <https://apt.bobine.fit> |
| Disclosure site | <https://security.bobine.fit> |
| Software | [FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine) (AGPL-3.0) |
| This repository | the source of the website, published to be read: see [License](#license) |

## Download Bobine Software

Official binary releases and installation methods for the Bobine video playout system:

| Platform | Format | Architecture | Direct Download / Command | Target Profile & Key Features |
| :--- | :---: | :---: | :---: | :--- |
| ![](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white) | <sub>`.apk`<br>*(Native Package)*</sub> | <sub>ARM64<br>*(arm64-v8a)*</sub> | <sub>[**Download Bobine-5.0.2.apk**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/Bobine-5.0.2.apk)</sub> | **Android Tablets, Google Books & ARM Kiosks**<br><sub>Touch coach desk (`/grid`) + HDMI TV cinema (`/cinema`), Google Books via APK (and soon native Google Play Store)</sub> |
| ![](https://img.shields.io/badge/Android_TV-009688?style=flat-square&logo=android&logoColor=white) | <sub>`.apk`<br>*(Dedicated TV Package)*</sub> | <sub>ARM 32 & 64-bit<br>*(armeabi-v7a, arm64-v8a)*</sub> | <sub>[**Download Bobine-TV-5.0.2.apk**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/Bobine-TV-5.0.2.apk)</sub> | **Android TV & Google TV**<br><sub>Leanback TV launcher, D-Pad remote navigation, offline kiosk</sub> |
| ![](https://img.shields.io/badge/Windows_11-0078D4?style=flat-square&logo=windows11&logoColor=white) | <sub>`.exe`<br>*(Installer)*</sub> | <sub>x86-64 & ARM64<br>*(Snapdragon)*</sub> | <sub>[**Bobine-Setup-5.0.2.exe (x86-64)**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/Bobine-Setup-5.0.2.exe)<br>[**Bobine-Setup-5.0.2-arm64.exe (ARM64)**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/Bobine-Setup-5.0.2-arm64.exe)</sub> | **Windows x86-64 & Windows ARM (Snapdragon)**<br><sub>Native 1-click installer for x86-64 and ARM64 (Snapdragon X Elite / X Plus), clamshell mode</sub> |
| [![Debian](https://img.shields.io/badge/Debian-A81D33?style=flat-square&logo=debian&logoColor=white)](https://www.debian.org/) [![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com/)<br>[![Linux Mint](https://img.shields.io/badge/Linux%20Mint-386D20?style=flat-square&logo=linuxmint&logoColor=white)](https://linuxmint.com/) [![Pop!_OS](https://img.shields.io/badge/Pop%21__OS-287D86?style=flat-square&logo=popos&logoColor=white)](https://system76.com/pop)<br>[![Zorin OS](https://img.shields.io/badge/Zorin%20OS-0969A2?style=flat-square&logo=zorin&logoColor=white)](https://zorin.com/os/) | <sub>`.deb`<br>APT</sub> | <sub>x86-64 (`amd64`)<br>ARM64 (`arm64`)</sub> | <sub>[**APT repository**](https://apt.bobine.fit)<br>[**bobine_5.0.2_amd64.deb**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/bobine_5.0.2_amd64.deb)<br>[**bobine_5.0.2_arm64.deb**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/bobine_5.0.2_arm64.deb)</sub> | **Debian, Ubuntu and derivatives**<br><sub>Packages available. Linux Mint (Ubuntu or LMDE), Pop!_OS and Zorin OS: use the APT family package if dependencies are satisfied; individual validation is still required.</sub> |
| [![Fedora](https://img.shields.io/badge/Fedora-294172?style=flat-square&logo=fedora&logoColor=white)](https://fedoraproject.org/) [![Nobara](https://img.shields.io/badge/Nobara-303030?style=flat-square&logo=nobaralinux&logoColor=white)](https://nobaraproject.org/) | <sub>`.rpm`<br>DNF</sub> | <sub>x86-64 (`x86_64`)<br>ARM64 (`aarch64`)<br>planned targets</sub> | <sub>**In preparation**<br>[**RPM repository status**](https://github.com/FantasmaGlad/bobine-rpm)</sub> | **Fedora / Nobara**<br><sub>Signed package and repository integration is in progress. Nobara is a Fedora derivative; neither Fedora nor Nobara has been validated on hardware yet.</sub> |
| [![Arch Linux](https://img.shields.io/badge/Arch%20Linux-126B96?style=flat-square&logo=archlinux&logoColor=white)](https://archlinux.org/) [![EndeavourOS](https://img.shields.io/badge/EndeavourOS-5540A5?style=flat-square&logo=endeavouros&logoColor=white)](https://endeavouros.com/)<br>[![CachyOS](https://img.shields.io/badge/CachyOS-006655?style=flat-square&logo=cachyos&logoColor=white)](https://cachyos.org/) [![Manjaro](https://img.shields.io/badge/Manjaro-176D49?style=flat-square&logo=manjaro&logoColor=white)](https://manjaro.org/) | <sub>`.pkg.tar.zst`<br>pacman</sub> | <sub>x86-64 (`x86_64`)<br>ARM64 (`aarch64`)<br>planned targets</sub> | <sub>**In preparation**<br>[**Arch repository status**](https://github.com/FantasmaGlad/bobine-arch)</sub> | **Arch Linux / derivatives**<br><sub>Signed package and repository integration is in progress. EndeavourOS and CachyOS are derivative targets awaiting validation. Manjaro needs a separate compatibility check because its repositories follow their own cadence.</sub> |
| ![](https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white) | <sub>`.dmg`<br>*(Disk Image)*</sub> | <sub>Apple Silicon<br>*(arm64)*</sub> | <sub>[**Download Bobine-5.0.2.dmg**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/Bobine-5.0.2.dmg)</sub> | **MacBook, Mac mini & iMac**<br><sub>Drag-and-drop `.dmg`, Apple Silicon, menu bar companion</sub> |
| ![](https://img.shields.io/badge/iOS%20%2F%20iPadOS-000000?style=flat-square&logo=apple&logoColor=white) | <sub>iPadOS App<br>*(Explored Track)*</sub> | <sub>ARM64 (Apple Silicon)</sub> | <sub>*Explored track...*</sub> | **iPads & Apple Tablets (Explored Track)**<br><sub>Touch coach desk prototype with USB-C / Thunderbolt video output</sub> |
| ![](https://img.shields.io/badge/Bobine_Assistant-FFC131?style=flat-square&logo=tauri&logoColor=black) | <sub>Native Binary<br>*(Tauri 2)*</sub> | <sub>x86-64 & ARM64<br>*(Linux)*</sub> | <sub>[**bobine-assistant (x86-64)**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/bobine-assistant)<br>[**bobine-assistant-arm64 (ARM64)**](https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.2/bobine-assistant-arm64)</sub> | **Management Assistant (GUI)**<br><sub>Network auto-discovery, SSH remote deploy & update tool</sub> |
| ![](https://img.shields.io/badge/Bash_CLI-4EAA25?style=flat-square&logo=gnubash&logoColor=white) | <sub>Shell Script<br>*(Automated)*</sub> | <sub>x86-64 & ARM64</sub> | <sub>`curl -sSL https://bobine.fit/install.sh \| bash`</sub> | **Headless Dedicated Appliance**<br><sub>Automated install for bare-metal mini PCs and ARM64 stations (Debian 13)</sub> |
| [![](https://img.shields.io/badge/Tor_Browser-7D4698?style=flat-square&logo=torbrowser&logoColor=white)](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) | <sub>APT Repo & Mirror<br>*(Tor Network)*</sub> | <sub>x86-64 & ARM64</sub> | <sub>`curl -fsSL https://bobine.fit/install-tor.sh \| bash`<br>[**Tor Mirror (.onion)**](http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/)<br>[**APT Repo (.onion)**](http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/)</sub> | **Tor Network (.onion)**<br><sub>Anonymous APT repo (Stable, Beta and Canary suites, channel chosen with `--channel`) and website mirror without IP exposure</sub> |
| [![](https://img.shields.io/badge/bobine.fit-4285F4?style=flat-square&logo=data%3Aimage/svg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBmaWxsPSIjNENBRjUwIiBkPSJNNDQgMjRjMCAxMS4wNDUtOC45NTUgMjAtMjAgMjAtNC41MiAwLTguNjgtMS41MDMtMTIuMDMtNC4wNDNsOS40NjctMTYuMzk0QTggOCAwIDAgMCAyNCAzMmM0LjQxOCAwIDgtMy41ODIgOC04eiIvPjxwYXRoIGZpbGw9IiNGQkMwMkQiIGQ9Ik00NCAyNEgyNGE4IDggMCAwIDAtNi45MjggNGwtOS40NjcgMTYuMzk0QTE5LjkyIDE5LjkyIDAgMCAxIDQgMjRDNCAxMy45ODcgMTEuMzg1IDUuNzA0IDIxLjAzNiA0LjIyTDMwLjUwMyAyMC42MUE3Ljk3IDcuOTcgMCAwIDAgMzIgMjR6Ii8%2BPHBhdGggZmlsbD0iI0U1MzkzNSIgZD0iTTI0IDRjNy40MDYgMCAxMy44NiA0LjAyNCAxNy4zIDEwLjAyN0wzMC41MDMgMjAuNjFBOCA4IDAgMCAwIDI0IDE2Yy0zLjE1NSAwLTUuOTE0IDEuODI2LTcuMjUgNC40OUw3LjI4NCA0LjA5NUMxMS44OTIgNC4wMzIgMTcuNjUgNCAyNCA0eiIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjgiIGZpbGw9IiNGRkYiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSI2IiBmaWxsPSIjMTk3NkQyIi8%2BPC9zdmc%2B)](https://bobine.fit) | <sub>Web Portal</sub> | <sub>Universal</sub> | <sub>[**Visit bobine.fit**](https://bobine.fit)</sub> | **Official Website**<br><sub>Getting started guides, hardware recommendations & docs</sub> |
| ![](https://img.shields.io/badge/GitHub-Releases-181717?style=flat-square&logo=github&logoColor=white) | <sub>Source & Binaries</sub> | <sub>Multi-OS</sub> | <sub>[**Browse GitHub Releases**](https://github.com/FantasmaGlad/Bobine/releases/latest)</sub> | **Releases & Source Code**<br><sub>Certified SHA-256 checksums, tarballs & full changelog</sub> |

### Linux distributions: support scope

Logos link to the distributions’ official websites. APT links lead to available packages; RPM and Arch links show repository rollout status. Distributions in the same family share a package format, which does not guarantee every version, dependency set, architecture or hardware configuration. Listing a derivative above does not mean it has been individually validated for Bobine.

[![RHEL](https://img.shields.io/badge/RHEL-A60000?style=flat-square&logo=redhat&logoColor=white)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) [![AlmaLinux](https://img.shields.io/badge/AlmaLinux-303030?style=flat-square&logo=almalinux&logoColor=white)](https://almalinux.org/) [![Rocky Linux](https://img.shields.io/badge/Rocky%20Linux-087752?style=flat-square&logo=rockylinux&logoColor=white)](https://rockylinux.org/)

RHEL, AlmaLinux and Rocky Linux are RPM-family systems requiring separate evaluation: compatibility with the Fedora package is unproven, and adding EPEL alone does not establish it. Immutable editions (Silverblue, Kinoite, Bazzite) need a dedicated installation method that is not provided here. The kiosk appliance installer still targets **Debian 13**; desktop package support does not extend that installer to other distributions. ARM64 binaries require an ARM64 system and do not imply that every derivative offers that architecture.

## Highlights

- **Two languages, one source of truth.** French and English pages share a single content source (`src/content/docs/`) that feeds the documentation, the FAQ, the downloadable PDF and the assistant, so a fact is written once.
- **Design system with 16 themes** (8 light, 8 dark), unified with the Bobine application in plain CSS variables, calibrated for WCAG AA and AAA contrast, with interface animations that respect `prefers-reduced-motion`.
- **Translucent glass built from tokens.** Every blur and glass surface comes from variables (`--blur-*`, `--glass-*`, including `--glass-modal-bg` for the download window), with a `prefers-reduced-transparency` mode; `scripts/ci/glass-check.mjs` fails the pipeline on a frozen value, an undefined variable or a text contrast below target on any of the 16 themes.
- **Three update channels everywhere.** Stable, Beta and Canary are offered in the download window, on every search-indexed page (device-aware download card), in the shell installers (`install.sh --channel=stable|beta|canary`, and `install-tor.sh --channel=stable|beta|canary` with an interactive prompt on a terminal) and in the two installation simulators (shell, with a Tor mode that asks for the channel, and the Tauri assistant with its three channel cards).
- **A Tor mirror built from the same code.** The site is exported as a static build and served as a v3 onion service, next to an APT repository that publishes the three suites (`stable`, `beta`, `canary`). The build removes every server route and fails the pipeline if a marketplace link, an external resource or an analytics script slips in.
- **Baamix**, an assistant that answers about installation and hardware choice. Its product cards come from the real catalog, never from the model's text.
- **A hardware shop with live shopping basket**, Amazon and AliExpress affiliate catalogs, and one place for every price and identifier.
- **Verifiable security posture.** An OpenPGP-signed `security.txt` ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)), a published report key whose fingerprint is checked daily across four independent channels, and a disclosure site hosted separately from the website.
- **A delivery pipeline run by GitHub Actions**: validation, deployment and live tests are one workflow, and the host's own Git integration is switched off.

## Architecture

```mermaid
flowchart LR
  PR[Pull request] --> CI["CI: policy, types, lint, build,<br/>Tor export, security site"]
  CI --> Main[main]
  Main --> Deploy[Deployment workflow]
  Deploy --> Web["Website bobine.fit"]
  Deploy --> Sec["security.bobine.fit<br/>(GitHub Pages)"]
  Main --> Onion["Static export<br/>branch onion-site"]
  Onion --> Tor["Tor mirror<br/>(.onion)"]
  Web --> Smoke[Live tests]
  Sec --> Smoke
  Tor --> Probe[Probe through Tor]
```

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Content | Typed data modules (`src/content/`), release notes read from GitHub Releases; PDF export with `@react-pdf/renderer` |
| Styling | Plain CSS with variables, no UI framework |
| Assistant | Server route with provider fallback; catalog resolved server-side |
| Hosting | Vercel behind Cloudflare, deployed by GitHub Actions; Tor mirror on a self-hosted machine |

## Quality and delivery

Nothing is published without passing the validation workflow, which checks on every pull request:

- repository policy: only an allow-listed set of root entries, no secret, no emoji, no forbidden trailer;
- `tsc --noEmit`, ESLint and the production build;
- the glass and style tokens, and text contrast on every glass material of the 16 themes (`glass-check.mjs`);
- the installation simulators against the published scripts (`check-simulator-sync.sh`: same step titles, same three channels);
- the static Tor export and its guarantees (no external resource, no marketplace link, no measurement script), ShellCheck on the shell scripts, and the identity of `public/install-tor.sh` with its deployment copy;
- the security site: signature of `security.txt`, fingerprint, expirations, local links (`check-security-site.sh`).

After publication, live tests query the real website, the disclosure site and the onion service through Tor. CodeQL, a daily check of the OpenPGP fingerprint and a daily consistency check with the Bobine releases (`check-release-sync.sh`: `install.sh` identical to the software's, download files present for Stable, Beta and Canary) run continuously.

## Run it locally

For reading and reviewing only: the [license](#license) does not grant the right to use or deploy this code.

```bash
npm ci
cp .env.example .env.local   # optional: the site works without any key
npm run dev                  # http://localhost:3000
```

## Security

Report vulnerabilities privately, never through a public issue: see [SECURITY.md](SECURITY.md) and <https://bobine.fit/en/security>. The report key fingerprint is `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`.

## Contributing

Mistake reports and suggestions are welcome as issues; code contributions follow [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Contributions are assigned to Bobine, as explained there.

## License

Copyright (c) 2026 Bobine. All rights reserved. The source is published for reading only: you may not copy, use, modify or distribute it. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for third-party components. The Bobine software is a separate project under the GNU AGPL-3.0.
