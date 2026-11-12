#!/usr/bin/env node
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");

if (process.env.CI !== "true" && !force) {
  console.error("Refus : ce script supprime des fichiers du dépôt. Utiliser --force sur une copie jetable.");
  process.exit(1);
}

const targets = [
  "src/app/api",
  "src/proxy.ts",
];

for (const target of targets) {
  await rm(path.join(root, target), { recursive: true, force: true });
  console.log(`retiré : ${target}`);
}
