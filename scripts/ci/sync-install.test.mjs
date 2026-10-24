import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { releaseMetadata, syncInstaller, verifyServedInstaller } from "./sync-install.mjs";

const body = Buffer.from("#!/usr/bin/env bash\nprintf 'installer'\n");
const digest = "sha256:" + createHash("sha256").update(body).digest("hex");
function fixture(overrides = {}) {
  return { id: 100, tag_name: "V1.2.3", draft: false, prerelease: false, assets: [{ id: 200, name: "install.sh", size: body.length, digest, browser_download_url: "https://github.com/FantasmaGlad/Bobine/releases/download/V1.2.3/install.sh" }], ...overrides };
}
const metadata = (release = fixture(), asset = body) => async (url) => url.startsWith("https://api.github.com/") ? Response.json(release) : new Response(asset);
const directory = () => mkdtemp(join(tmpdir(), "bobine-install-test-"));

test("synchroniser puis vérifier les octets réellement servis", async () => {
  const dir = await directory();
  try {
    const calls = [];
    const request = async (url, options) => { calls.push({ url, options }); return metadata()(url); };
    await syncInstaller(dir, request);
    assert.deepEqual(await readFile(join(dir, "install.sh")), body);
    assert.equal(calls[1].options.headers, undefined);
    await verifyServedInstaller(join(dir, "install.sh"), join(dir, "install-source.json"), metadata());
    await writeFile(join(dir, "install.sh"), Buffer.from("#!/usr/bin/env bash\necho changed\n"));
    await assert.rejects(verifyServedInstaller(join(dir, "install.sh"), join(dir, "install-source.json"), metadata()), /digest/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

for (const [name, release] of [
  ["prérelease", fixture({ prerelease: true })],
  ["brouillon", fixture({ draft: true })],
  ["asset absent", fixture({ assets: [] })],
  ["digest absent", fixture({ assets: [{ ...fixture().assets[0], digest: null }] })],
  ["URL étrangère", fixture({ assets: [{ ...fixture().assets[0], browser_download_url: "https://example.org/install.sh" }] })],
]) test(`refuser une source non canonique : ${name}`, async () => {
  await assert.rejects(releaseMetadata(undefined, metadata(release)));
});

test("un téléchargement corrompu ne remplace pas l’installateur existant", async () => {
  const dir = await directory();
  try {
    await writeFile(join(dir, "install.sh"), "previous");
    await assert.rejects(syncInstaller(dir, metadata(fixture(), Buffer.from("bad"))), /digest/);
    assert.equal(await readFile(join(dir, "install.sh"), "utf8"), "previous");
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("refuser une provenance qui usurpe le digest de la release", async () => {
  const dir = await directory();
  try {
    await syncInstaller(dir, metadata());
    const source = JSON.parse(await readFile(join(dir, "install-source.json"), "utf8"));
    source.asset_id++;
    await writeFile(join(dir, "install-source.json"), JSON.stringify(source));
    await assert.rejects(verifyServedInstaller(join(dir, "install.sh"), join(dir, "install-source.json"), metadata()), /Provenance/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
