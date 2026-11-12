#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../../", import.meta.url)), "public/.well-known/csaf");
const errors = [];
const fail = (m) => errors.push(m);

let meta = {};
try { meta = JSON.parse(readFileSync(join(root, "provider-metadata.json"), "utf8")); } catch (e) { fail(`provider-metadata.json illisible : ${e.message}`); }

const BASE = "https://bobine.fit/.well-known/csaf";
if (meta.canonical_url !== `${BASE}/provider-metadata.json`) fail("canonical_url inattendue");
if (meta.metadata_version !== "2.0") fail("metadata_version doit valoir 2.0");
if (!["csaf_publisher", "csaf_provider", "csaf_trusted_provider"].includes(meta.role)) fail("role invalide");
if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/.test(meta.last_updated ?? "")) fail("last_updated invalide");
if (typeof meta.list_on_CSAF_aggregators !== "boolean" || typeof meta.mirror_on_CSAF_aggregators !== "boolean") fail("indicateurs d'agrégateurs absents");
const pub = meta.publisher ?? {};
if (pub.category !== "vendor" || !pub.name || pub.namespace !== "https://bobine.fit") fail("publisher incomplet");
const dirs = meta.distributions ?? [];
if (!dirs.length || dirs.some((d) => !String(d.directory_url ?? "").startsWith(`${BASE}/`) || !String(d.directory_url).endsWith("/"))) fail("distributions.directory_url invalide");
const fpr = readFileSync(join(root, "../../../security/fingerprint.txt"), "utf8").trim();
const keys = meta.public_openpgp_keys ?? [];
if (!keys.some((k) => k.fingerprint === fpr)) fail(`public_openpgp_keys doit contenir l'empreinte ${fpr}`);

for (const file of ["white/index.txt", "white/changes.csv"]) if (!existsSync(join(root, file))) fail(`${file} absent`);
if (existsSync(join(root, "white/index.txt"))) {
  for (const line of readFileSync(join(root, "white/index.txt"), "utf8").split("\n").filter(Boolean)) {
    for (const ext of ["", ".asc", ".sha512"]) if (!existsSync(join(root, "white", line + ext))) fail(`avis listé sans fichier : white/${line}${ext}`);
  }
}

if (errors.length) { console.error(errors.map((e) => `::error::${e}`).join("\n")); process.exit(1); }
console.log("check-csaf : métadonnées valides, aucun avis publié, index et journal présents.");
