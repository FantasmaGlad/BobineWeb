import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { releaseMetadata, syncInstaller, verifyServedInstaller } from "./sync-install.mjs";

const body = Buffer.from("# Installe Bobine sous Windows\r\nparam([string]$Channel = 'stable')\r\n");
const digest = "sha256:" + createHash("sha256").update(body).digest("hex");
function fixture(overrides = {}) {
  return { id: 100, tag_name: "V1.2.3", draft: false, prerelease: false, assets: [{ id: 200, name: "install.ps1", size: body.length, digest, browser_download_url: "https://github.com/FantasmaGlad/Bobine/releases/download/V1.2.3/install.ps1" }], ...overrides };
}
const metadata = (release = fixture(), asset = body) => async (url) => url.startsWith("https://api.github.com/") ? Response.json(release) : new Response(asset);
const directory = () => mkdtemp(join(tmpdir(), "bobine-install-test-"));

test("synchroniser puis vérifier les octets réellement servis", async () => {
  const dir = await directory();
  try {
    const calls = [];
    const request = async (url, options) => { calls.push({ url, options }); return metadata()(url); };
    await syncInstaller(dir, request);
    assert.deepEqual(await readFile(join(dir, "install.ps1")), body);
    assert.equal(calls[1].options.headers, undefined);
    await verifyServedInstaller(join(dir, "install.ps1"), join(dir, "install-ps1-source.json"), metadata());
    await writeFile(join(dir, "install.ps1"), Buffer.from("# change\r\n"));
    await assert.rejects(verifyServedInstaller(join(dir, "install.ps1"), join(dir, "install-ps1-source.json"), metadata()), /digest/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

for (const [name, release] of [
  ["prérelease", fixture({ prerelease: true })],
  ["brouillon", fixture({ draft: true })],
  ["asset absent", fixture({ assets: [] })],
  ["digest absent", fixture({ assets: [{ ...fixture().assets[0], digest: null }] })],
  ["URL étrangère", fixture({ assets: [{ ...fixture().assets[0], browser_download_url: "https://example.org/install.ps1" }] })],
]) test(`refuser une source non canonique : ${name}`, async () => {
  await assert.rejects(releaseMetadata(undefined, metadata(release)));
});

test("un téléchargement corrompu ne remplace pas l’installateur existant", async () => {
  const dir = await directory();
  try {
    await writeFile(join(dir, "install.ps1"), "previous");
    await assert.rejects(syncInstaller(dir, metadata(fixture(), Buffer.from("bad"))), /digest/);
    assert.equal(await readFile(join(dir, "install.ps1"), "utf8"), "previous");
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("refuser une provenance qui usurpe le digest de la release", async () => {
  const dir = await directory();
  try {
    await syncInstaller(dir, metadata());
    const source = JSON.parse(await readFile(join(dir, "install-ps1-source.json"), "utf8"));
    source.asset_id++;
    await writeFile(join(dir, "install-ps1-source.json"), JSON.stringify(source));
    await assert.rejects(verifyServedInstaller(join(dir, "install.ps1"), join(dir, "install-ps1-source.json"), metadata()), /Provenance/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("refuser une page HTML servie à la place de install.ps1", async () => {
  const html = Buffer.from("<html>erreur</html>");
  const release = fixture({ assets: [{ ...fixture().assets[0], size: html.length, digest: "sha256:" + createHash("sha256").update(html).digest("hex") }] });
  const dir = await directory();
  try {
    await assert.rejects(syncInstaller(dir, metadata(release, html)), /HTML/);
    await assert.rejects(readFile(join(dir, "install.ps1")), /ENOENT/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
