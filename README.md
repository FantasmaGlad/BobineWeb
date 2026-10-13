# bobine.fit

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

## Highlights

- **Two languages, one source of truth.** French and English pages share a single content source (`src/content/docs/`) that feeds the documentation, the FAQ, the downloadable PDF and the assistant, so a fact is written once.
- **Design system with 17 themes** (8 light, 9 dark), in plain CSS variables, calibrated for WCAG AA and AAA contrast, with interface animations that respect `prefers-reduced-motion`.
- **Interactive 3D** with Three.js and React Three Fiber, using locally served decoders so that no third party is contacted.
- **A Tor mirror built from the same code.** The site is exported as a static build and served as a v3 onion service, next to an APT repository. The build removes every server route and fails the pipeline if a marketplace link, an external resource or an analytics script slips in.
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
| Content | MDX and typed data modules; PDF export with `@react-pdf/renderer` |
| Styling | Plain CSS with variables, no UI framework |
| 3D | Three.js, React Three Fiber, Drei |
| Assistant | Server route with provider fallback; catalog resolved server-side |
| Hosting | Vercel behind Cloudflare, deployed by GitHub Actions; Tor mirror on a self-hosted machine |

## Quality and delivery

Nothing is published without passing the validation workflow, which checks on every pull request:

- repository policy: only an allow-listed set of root entries, no secret, no emoji, no forbidden trailer;
- `tsc --noEmit`, ESLint and the production build;
- the static Tor export and its guarantees (no external resource, no marketplace link, no measurement script);
- the security site: signature of `security.txt`, fingerprint, expirations, local links.

After publication, live tests query the real website, the disclosure site and the onion service through Tor. CodeQL and a daily check of the OpenPGP fingerprint run continuously. Details: [`docs/DEVELOPPEMENT.md`](docs/DEVELOPPEMENT.md) (in French).

## Run it locally

For reading and reviewing only: the [license](#license) does not grant the right to use or deploy this code.

```bash
npm ci
cp .env.example .env.local   # optional: the site works without any key
npm run dev                  # http://localhost:3000
```

## Security

Report vulnerabilities privately, never through a public issue: see [SECURITY.md](SECURITY.md) and <https://bobine.fit/en/securite>. The report key fingerprint is `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`.

## Contributing

Mistake reports and suggestions are welcome as issues; code contributions follow [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Contributions are assigned to Bobine, as explained there.

## License

Copyright (c) 2026 Bobine. All rights reserved. The source is published for reading only: you may not copy, use, modify or distribute it. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for third-party components. The Bobine software is a separate project under the GNU AGPL-3.0.
