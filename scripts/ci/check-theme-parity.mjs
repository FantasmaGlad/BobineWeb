#!/usr/bin/env node
// Les palettes du site (src/lib/themePalettes.ts) doivent être identiques à celles de l'application Bobine
// (frontend/src/lib/themePalettes.ts) : une seule source, deux copies. Usage : check-theme-parity.mjs [dossier de Bobine]
// Sans copie de l'application à comparer, un avertissement (la CI clone Bobine dans BOBINE_SOURCE_DIR).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const source = process.argv[2] ?? process.env.BOBINE_SOURCE_DIR;
const theirs = source ? join(source, "frontend/src/lib/themePalettes.ts") : "";
if (!theirs || !existsSync(theirs)) {
  console.log("::warning::themePalettes.ts de l'application introuvable : parité des palettes non vérifiée.");
  process.exit(0);
}
if (readFileSync("src/lib/themePalettes.ts", "utf8") !== readFileSync(theirs, "utf8")) {
  console.error("::error::src/lib/themePalettes.ts diffère de frontend/src/lib/themePalettes.ts de Bobine : recopier le fichier de l'application.");
  process.exit(1);
}
console.log("check-theme-parity : palettes identiques à celles de l'application.");
