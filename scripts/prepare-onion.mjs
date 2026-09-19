#!/usr/bin/env node
/**
 * Prépare une copie de travail JETABLE pour l'export statique du miroir Tor :
 * retire ce qu'un export statique ne peut pas porter (routes serveur, proxy).
 * Refuse de tourner hors CI, pour ne jamais amputer un dépôt de développement.
 */
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
  "src/app/api", // chat Baamix, catalogue, statistiques GitHub, callback AliExpress
  "src/proxy.ts", // redirections de langue : refaites dans Caddy
];

for (const target of targets) {
  await rm(path.join(root, target), { recursive: true, force: true });
  console.log(`retiré : ${target}`);
}
