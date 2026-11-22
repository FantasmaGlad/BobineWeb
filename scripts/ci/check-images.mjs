#!/usr/bin/env node
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const files = walk(join(root, "public/images"));
for (const file of files) assert(statSync(file).size <= 250 * 1024, `${file}: image > 250 Ko`);
console.log(`Images : ${files.length} fichiers, aucun au-delà de 250 Ko.`);
