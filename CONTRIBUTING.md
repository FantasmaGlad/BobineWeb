# Contributing to BobineWeb

This repository is the source of the website <https://bobine.fit>. It is published so that its work can be read, not so that it can be reused: see [LICENSE](LICENSE). Contributions are still welcome on the terms below, because a reader who spots a mistake is the best reviewer the site can have.

French version: [docs/fr/CONTRIBUTING.md](docs/fr/CONTRIBUTING.md). By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Vulnerabilities are not reported through issues or pull requests: see [SECURITY.md](SECURITY.md). The Bobine software has its own repository, [FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine), with its own contribution guide.

## What is welcome

- Reports of mistakes: wrong or outdated information, broken links, accessibility problems, display bugs, a page that does not work on a given browser or device.
- Suggestions for the content, the design or the structure of the site.
- Small, well-scoped fixes: typos, translations, a broken style, an incorrect statement.

For anything beyond a small, obvious fix (a new page, a behavior change, a refactoring, a new dependency), open an issue and agree on the approach before writing code. Unsolicited large pull requests are likely to be declined, whatever their quality. Issues and pull requests may be written in English or French.

## Principles

**Evidence, not assumption.** A problem is understood when you can reproduce it and point to its cause. Back your claims with facts: the page and language, the browser and version, the exact steps, the expected and the observed result.

**Accuracy before marketing.** The site never claims a feature that is not shipped in Bobine, never shows an invented rating or review, and never writes a price outside its single source. If you are not sure that something is true, say so in the issue instead of editing the text.

**One source per fact.** Product documentation and the FAQ live in `src/content/docs/` and feed the pages, the PDF and the assistant; hardware prices and identifiers live in `src/content/hardware.ts`. Never copy a fact by hand into another file.

**Root cause, not symptom.** Do not mask an error with a silent `try`/`catch`, a retry or a special case that hides the real failure.

**Say what you did not verify.** State precisely what you tested, on which system and version, and what you could not test.

## You are responsible for your code

Whatever tools you use to write code, you are the author of what you submit, and you answer for it.

- You must be able to explain every line of your change and why it is there, without help, during review.
- You must have run it. A pull request describing checks that were not executed, or referring to files, options or functions that do not exist, will be closed.
- You must have the right to contribute it (see Licensing below), and the provenance of any large block you did not write yourself must be verifiable.
- You must follow the conventions and style of the codebase, and strip what adds no value: restated comments, unrelated reformatting, speculative abstractions, padded descriptions.
- Automated or bulk submissions (scripts opening pull requests, mass reformatting, mass dependency changes) are not accepted. Dependency updates are handled by the maintainer.

Maintainers review contributions in their own time. Making the review short is your responsibility.

## Development setup

Node 22 and npm.

```bash
npm ci
cp .env.example .env.local   # optional: the site works without any key
npm run dev                  # http://localhost:3000
```

Without any key the site still runs: the assistant answers 503, the AliExpress catalog uses its snapshot, and the displayed version falls back to a default value. Never commit `.env.local` or any key.

Before opening a pull request, run the same checks as CI:

```bash
npx tsc --noEmit    # TypeScript, 0 error
npm run lint        # ESLint, 0 error
npm run build       # production build
```

If you touch styles, the installation simulators or the shell scripts, also run the guards that CI runs on them:

```bash
node scripts/ci/glass-check.mjs          # glass tokens, no frozen value, no stylesheet over 600 lines, text contrast on the 16 themes
bash scripts/ci/check-simulator-sync.sh  # simulators aligned with public/install.sh and public/install-tor.sh
bash scripts/ci/policy-check.sh          # repository policy (root entries, secrets, emoji)
```

`public/install-tor.sh` must stay identical to its deployment copy `deploy/onion/install-client.sh` (`cmp`, checked by CI).

`npm run build:onion` builds the static Tor mirror and is reserved to CI: it deletes `src/app/api` and `src/proxy.ts` and refuses to run elsewhere. To test the mirror locally, copy the repository, with its `node_modules`, to a temporary folder.

Next.js 16 has breaking changes compared with earlier versions: read the relevant guide in `node_modules/next/dist/docs/` before writing code.

## Project conventions

- **No emoji** in the interface, the documentation or the code. Icons are outline SVG (`fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`) or typography.
- **Two languages**: French (default) and English. A user-facing change updates both.
- **Tor mirror**: a new feature must work without a server route or a third-party resource when `IS_ONION` is true, or degrade cleanly. Do not load any font, script or decoder from outside the site.
- **Legal pages**: any new local storage, cookie, measurement tool, provider or data flow requires updating `mentions-legales` and `confidentialite`, and their "last updated" line, in the same change.
- **Styles**: no stylesheet over 600 lines. `src/app/globals.css` is only a list of `@import` lines in cascade order, pointing at `src/styles/base/NN-*.css`; put a new rule in the part that matches its domain (or in a component stylesheet under `src/styles/components/`), never at the end of a growing file, and keep the import order, which is the cascade. Colors, blur, radii and sizes come from tokens (`glass-check` refuses frozen values and stylesheets that are too long).
- **Comments** explain a lasting reason (a constraint, a trap, a non-obvious choice). No history, no commented-out code, no decorative banners.
- **Secrets** never go in the code, a comment, a screenshot or a log. The variables are listed in `.env.example`.

## Commits

BobineWeb uses [Conventional Commits](https://www.conventionalcommits.org/), in lowercase, with a scope:

```
type(scope): short description in the imperative mood
```

| Type | Use |
|---|---|
| `feat` | a user-visible feature |
| `fix` | a bug fix |
| `refactor` | a change with no behavior change |
| `perf` | a measured performance improvement |
| `docs` | documentation only |
| `build`, `ci`, `chore` | tooling, pipelines, maintenance |
| `revert` | reverting a previous commit |

Examples taken from the history:

```
feat(materiel): catalogue AliExpress reel pour Windows via l'API Affiliate
fix(securite): comparaison des deux security.txt avec des noms de fichiers fixes
docs(onion): option d'installation APT via Tor, FAQ, script et documentation projet
```

- Messages may be in English or French, consistently within a pull request.
- For anything non-trivial, add a body as a bulleted list: the cause that was resolved, the mechanism introduced, and how it was tested.
- One logical change per commit; every commit must build. Do not leave fixup or "address review" commits in the final history.
- Keep your branch current by rebasing on `main` rather than merging `main` into it.

## Pull requests

Open the pull request against `main`. The description must contain:

1. **What and why**: the problem, with the issue number if there is one.
2. **How**: the approach, and the alternatives you rejected when relevant.
3. **Verification**: the exact commands you ran and their result, plus the browsers and devices checked.
4. **Risks**: what could regress, and how someone would notice.
5. **Documentation**: what you updated, or why nothing needed updating.

A pull request is merged when CI is green, the review is complete and the change fits the direction of the site. A decision not to merge is about the change, not about you; the reason is given. Pull requests from forks are checked by CI without access to any secret.

## Licensing and assignment of rights

BobineWeb is not open source: [LICENSE](LICENSE) allows reading only. Because the site must stay one coherent work that its owner can maintain and publish, every contribution is assigned to Bobine.

By submitting a contribution (pull request, patch, text, translation or any other content), you declare that:

1. you are its author, or hold the right to submit it, and it does not infringe the rights of anyone else;
2. you assign to Bobine, free of charge, for the whole world and for the entire duration of the protection, all the economic rights in the contribution, for every mode of exploitation, including the rights to reproduce, represent, adapt, translate, distribute and license it, in any form and on any medium;
3. Bobine may use the contribution under the license of the repository or under any other license it chooses;
4. your moral rights, which the law does not allow to be assigned, are kept: you may be named as a contributor if you ask for it.

If you cannot agree to this, do not submit code: you can still open an issue to describe the problem or the idea, and the maintainer will write the change.

Contributions to the Bobine software are handled in [its own repository](https://github.com/FantasmaGlad/Bobine), under its own license.

## Document history

| Date | Change |
|---|---|
| 2026-10-13 | Contribution guide adopted. |
