#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const COPIES = [
  ["src/lib/themePalettes.ts", "frontend/src/lib/themePalettes.ts"],
  ["src/content/reference/cli.json", "docs/reference/cli.json"],
  ["src/content/reference/api.json", "docs/reference/api.json"],
];

const source = process.argv[2] ?? process.env.BOBINE_SOURCE_DIR;
if (!source || !existsSync(source)) {
  console.log("::warning::sources de l'application introuvables : parité non vérifiée.");
  process.exit(0);
}
const stale = COPIES.filter(([ours, theirs]) => readFileSync(ours, "utf8") !== readFileSync(join(source, theirs), "utf8"));
for (const [ours, theirs] of stale) console.error(`::error::${ours} diffère de ${theirs} de Bobine : recopier le fichier de l'application.`);
if (stale.length) process.exit(1);
console.log(`check-app-parity : ${COPIES.length} fichiers identiques à ceux de l'application.`);
