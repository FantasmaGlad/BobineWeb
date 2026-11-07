#!/usr/bin/env node
// Génère security.bobine.fit (anglais à la racine, français sous /fr/) : HTML statique noir sur blanc, sans script.
// `--check` échoue si un fichier suivi par Git n'est pas à jour.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = join(root, "security/site");
const check = process.argv.includes("--check");
const SITE = "https://security.bobine.fit";
const FP = readFileSync(join(root, "security/fingerprint.txt"), "utf8").trim().replace(/(.{4})(?!$)/g, "$1 ");
const ADVISORY = "https://github.com/FantasmaGlad/Bobine/security/advisories/new";
const POLICY = "https://github.com/FantasmaGlad/Bobine/blob/main/SECURITY.md";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pre = (s) => `<pre><code>${esc(s)}</code></pre>`;

const T = {
  en: {
    path: "/", other: "/fr/", otherLabel: "Français",
    title: "Bobine security",
    description: "Report a Bobine vulnerability privately: OpenPGP key, fingerprint and signed security.txt.",
    lead: "Report vulnerabilities in the Bobine software, its website or its signed package repositories privately. Encrypt the report with the key below.",
    key: "Key", identity: "Identity", fingerprint: "Fingerprint", algorithms: "Algorithms", expires: "Expires", files: "Files",
    report: "Report",
    step1: "1. Fetch the key and check its fingerprint against the one above:",
    step2: "2. Encrypt the report. Attach your own public key to get an encrypted reply:",
    step3: `3. Send the encrypted file to <a href="mailto:security@bobine.fit">security@bobine.fit</a>, or open a <a href="${ADVISORY}">private GitHub report</a>.`,
    policy: `Full policy: <a href="${POLICY}">SECURITY.md</a>.`,
    history: "History",
    events: [
      ["2026-10-08", "This site published."],
      ["2026-10-07", "Current key put into service."],
    ],
  },
  fr: {
    path: "/fr/", other: "/", otherLabel: "English",
    title: "Sécurité de Bobine",
    description: "Signaler en privé une vulnérabilité de Bobine : clé OpenPGP, empreinte et security.txt signé.",
    lead: "Signalez en privé les failles du logiciel Bobine, de son site ou de ses dépôts de paquets signés. Chiffrez le rapport avec la clé ci-dessous.",
    key: "Clé", identity: "Identité", fingerprint: "Empreinte", algorithms: "Algorithmes", expires: "Expiration", files: "Fichiers",
    report: "Signaler",
    step1: "1. Récupérez la clé et comparez son empreinte avec celle ci-dessus :",
    step2: "2. Chiffrez le rapport. Joignez votre propre clé publique pour recevoir une réponse chiffrée :",
    step3: `3. Envoyez le fichier chiffré à <a href="mailto:security@bobine.fit">security@bobine.fit</a>, ou ouvrez un <a href="${ADVISORY}">signalement privé sur GitHub</a>.`,
    policy: `Politique complète : <a href="${POLICY}">SECURITY.md</a>.`,
    history: "Historique",
    events: [
      ["2026-10-08", "Publication de ce site."],
      ["2026-10-07", "Mise en service de la clé actuelle."],
    ],
  },
};

function page(lang) {
  const t = T[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${SITE}${t.path}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="fr" href="${SITE}/fr/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<main>
<header>
<h1>${esc(t.title)}</h1>
<p class="lead">${esc(t.lead)}</p>
</header>
<div class="columns">
<section>
<h2>${t.key}</h2>
<table>
<tr><th>${t.identity}</th><td>Bobine Security &lt;security@bobine.fit&gt;</td></tr>
<tr><th>${t.fingerprint}</th><td><code>${FP}</code></td></tr>
<tr><th>${t.algorithms}</th><td>Ed25519, Curve25519</td></tr>
<tr><th>${t.expires}</th><td>2028-10-06</td></tr>
<tr><th>${t.files}</th><td><a href="/security.asc">security.asc</a> · <a href="/.well-known/security.txt">security.txt</a></td></tr>
</table>
<h2 class="spaced">${t.history}</h2>
<ul>
${t.events.map(([d, e]) => `<li>${d}${lang === "fr" ? " : " : ": "}${esc(e)}</li>`).join("\n")}
</ul>
</section>
<section>
<h2>${t.report}</h2>
<p>${esc(t.step1)}</p>
${pre("gpg --locate-keys security@bobine.fit\ngpg --fingerprint security@bobine.fit")}
<p>${esc(t.step2)}</p>
${pre("gpg --armor --encrypt --recipient security@bobine.fit report.txt")}
<p>${t.step3}</p>
<p>${t.policy}</p>
</section>
</div>
</main>
<footer>
<p><a href="https://bobine.fit">bobine.fit</a> · <a href="https://github.com/FantasmaGlad/Bobine">GitHub</a> · <a href="${t.other}">${t.otherLabel}</a></p>
</footer>
</body>
</html>
`;
}

const files = {
  "index.html": page("en"),
  "fr/index.html": page("fr"),
  "assets/site.css": readFileSync(join(root, "scripts/security-site/site.css")),
  "favicon.ico": readFileSync(join(root, "public/favicon.ico")),
};
for (const [file, body] of Object.entries(files)) {
  const target = join(output, file);
  if (check) {
    if (!readFileSync(target).equals(Buffer.from(body))) throw new Error(`${file} : génération périmée (node scripts/security-site/build.mjs)`);
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
  }
}
console.log(`Site de sécurité : ${Object.keys(files).length} fichiers ${check ? "à jour" : "générés"}.`);
