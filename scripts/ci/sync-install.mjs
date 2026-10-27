#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const repository = "FantasmaGlad/Bobine";
const apiRoot = `https://api.github.com/repos/${repository}`;
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

export async function releaseMetadata(tag, request = fetch) {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const endpoint = tag ? `tags/${encodeURIComponent(tag)}` : "latest";
  const response = await request(`${apiRoot}/releases/${endpoint}`, { headers, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Release Stable inaccessible : HTTP ${response.status}`);
  const release = await response.json();
  if (release.draft !== false || release.prerelease !== false || !/^V?\d+\.\d+\.\d+$/.test(release.tag_name)) throw new Error("Release Stable attendue");
  const assets = release.assets.filter((asset) => asset.name === "install.sh");
  if (assets.length !== 1) throw new Error("Un seul asset install.sh est requis");
  const asset = assets[0];
  if (!/^sha256:[a-f0-9]{64}$/.test(asset.digest ?? "")) throw new Error("Digest SHA-256 GitHub absent ou invalide");
  const url = `https://github.com/${repository}/releases/download/${encodeURIComponent(release.tag_name)}/install.sh`;
  if (asset.browser_download_url !== url || !Number.isSafeInteger(asset.size) || asset.size < 2 || asset.size > 2_000_000) throw new Error("Asset install.sh non conforme");
  return { repository, tag: release.tag_name, release_id: release.id, asset_id: asset.id, url, size: asset.size, sha256: asset.digest.slice(7) };
}

export function verifyInstaller(script, source) {
  if (script.length !== source.size || sha256(script) !== source.sha256) throw new Error("L’installateur ne correspond pas au digest de la release");
  if (!script.subarray(0, 2).equals(Buffer.from("#!"))) throw new Error("Shebang de l’installateur absent");
}

export async function syncInstaller(destination, request = fetch) {
  const source = await releaseMetadata(undefined, request);
  // L’asset public est téléchargé sans transmettre le jeton de l’API aux redirections.
  const response = await request(source.url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Installateur inaccessible : HTTP ${response.status}`);
  const script = Buffer.from(await response.arrayBuffer());
  verifyInstaller(script, source);
  await mkdir(destination, { recursive: true });
  await writeFile(join(destination, "install.sh.tmp"), script);
  await writeFile(join(destination, "install-source.json.tmp"), JSON.stringify(source, null, 2) + "\n");
  await rename(join(destination, "install.sh.tmp"), join(destination, "install.sh"));
  await rename(join(destination, "install-source.json.tmp"), join(destination, "install-source.json"));
  console.log(`Installateur Stable ${source.tag} : SHA-256 ${source.sha256} vérifié.`);
}

export async function verifyServedInstaller(scriptPath, sourcePath, request = fetch) {
  const source = JSON.parse(await readFile(sourcePath, "utf8"));
  const canonical = await releaseMetadata(source.tag, request);
  for (const key of Object.keys(canonical)) if (source[key] !== canonical[key]) throw new Error(`Provenance différente de la release : ${key}`);
  verifyInstaller(await readFile(scriptPath), canonical);
  console.log(`Installateur servi conforme à la release ${canonical.tag}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv[2] === "--verify-served") await verifyServedInstaller(process.argv[3], process.argv[4]);
    else await syncInstaller(resolve("public"));
  } catch (error) {
    if (error.message?.includes("HTTP 403")) {
      const { existsSync } = await import("node:fs");
      if (existsSync(join(resolve("public"), "install.sh")) && existsSync(join(resolve("public"), "install-source.json"))) {
        console.warn("::warning::GitHub API rate-limited (HTTP 403) ; conservation de l'installateur existant dans public/");
        process.exit(0);
      }
    }
    console.error(error.message);
    process.exitCode = 1;
  }
}
