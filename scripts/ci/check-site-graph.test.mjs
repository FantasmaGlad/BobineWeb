// Tests d'injection du contrôle du plan du site : une régression de hiérarchie doit faire échouer le script.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./check-site-graph.mjs", import.meta.url));
const registry = JSON.parse(readFileSync(fileURLToPath(new URL("../../src/lib/siteMap.json", import.meta.url)), "utf8"));

function run(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "sitemap-"));
  try {
    const copy = structuredClone(registry);
    mutate(copy.routes);
    const file = join(dir, "siteMap.json");
    writeFileSync(file, JSON.stringify(copy));
    return spawnSync(process.execPath, [script], { env: { ...process.env, SITEMAP_JSON: file }, encoding: "utf8" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("le plan du site réel est conforme", () => {
  assert.equal(run(() => {}).status, 0);
});

test("une feuille sans parent hub est refusée", () => {
  const r = run((routes) => { routes.find((x) => x.id === "linux").parent = "features"; });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /linux : le parent « features » n'est pas un hub/);
});

test("une route sans page réelle est refusée", () => {
  const r = run((routes) => { routes.push({ ...routes.find((x) => x.id === "features"), id: "fantome", path: "/page-fantome" }); });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /fantome : aucune page/);
});

test("un hub dont un enfant n'est pas lié est refusé", () => {
  const r = run((routes) => { routes.push({ ...routes.find((x) => x.id === "features"), id: "orpheline", path: "/linux", parent: "download" }); });
  assert.equal(r.status, 1);
});

test("un pied de page trop long est refusé", () => {
  const r = run((routes) => { for (const x of routes) x.footer = "legal"; });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /pied de page/);
});
