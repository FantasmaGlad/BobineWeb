# Security Policy

This repository is the source of the website <https://bobine.fit>. The vulnerability-disclosure policy is published and maintained on the live site, and this page points to it. Always read the live policy: it is the one that applies.

French version: [docs/fr/SECURITY.md](docs/fr/SECURITY.md).

## Where the real policy is

| What | Where |
|---|---|
| Policy page (scope, commitments, timelines, history of keys) | <https://bobine.fit/en/security> ([fr](https://bobine.fit/fr/securite)) |
| Machine-readable policy, OpenPGP-signed ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)) | <https://bobine.fit/.well-known/security.txt> |
| Dedicated disclosure site, hosted separately from the website | <https://security.bobine.fit> |
| Policy of the Bobine software and of the APT repository | [FantasmaGlad/Bobine, SECURITY.md](https://github.com/FantasmaGlad/Bobine/blob/main/SECURITY.md) |

## Reporting a vulnerability

Do not open a public issue, discussion or pull request for a vulnerability. Use one of these private channels:

1. **GitHub private vulnerability reporting** (preferred for anything exploitable): [Security tab, "Report a vulnerability"](https://github.com/FantasmaGlad/BobineWeb/security/advisories/new). Only the maintainer can see the report.
2. **E-mail**: [security@bobine.fit](mailto:security@bobine.fit).

Please include the affected page or route, the steps to reproduce, the impact you observe and, if possible, a minimal proof of concept.

Any report containing exploitable details must be encrypted with the OpenPGP key of the policy. If you cannot use PGP, use the private GitHub report, which is encrypted in transit and visible only to the maintainer, rather than plain e-mail.

| | |
|---|---|
| Identity | Bobine Security `<security@bobine.fit>` |
| Fingerprint | `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2` |
| Where to fetch it | <https://bobine.fit/.well-known/security.asc>, <https://security.bobine.fit/security.asc>, `gpg --locate-keys security@bobine.fit` |

Retrieve the key from at least two independent channels and check that the fingerprint matches before use. The key is also published in the DNS of `bobine.fit` (`openpgp4fpr` record).

## Supported versions

Only the version currently served at <https://bobine.fit> (the `main` branch) receives fixes. There are no maintained earlier versions.

## Scope

In scope: the website `bobine.fit` and its server routes, the Tor mirror, and the repository's build and deployment pipelines. Out of scope: third-party services, social engineering, denial of service and mass scans, findings without a demonstrable impact, and content errors (report those as an ordinary issue). The full list is on the policy page.

## Good-faith research

Research carried out in good faith within the scope and the rules of the policy page will not lead to any action from us. This is also true of the repository license: [LICENSE](LICENSE) section 4.

## Secrets found in this repository

If you find a credential, a token or a private key in the repository or its history, report it as a vulnerability through the private channels above. Do not use it.
