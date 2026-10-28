import { plainSnippet } from "../../src/lib/rag/results.mjs";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
const git = (args, cwd) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 180000 }).trim();
const sha = text => createHash("sha256").update(text).digest("hex");
export function resolveCommit(repo, ref) {
  const lines = git(["ls-remote", repo, ref, `${ref}^{}`]).split("\n").filter(Boolean);
  if (!lines.length) throw new Error(`Référence amont absente : ${repo} ${ref}`);
  return (lines.find(line => line.endsWith("^{}")) || lines[0]).split(/\s/)[0];
}
export function refreshLock(root, bobineRoot) {
  const next = JSON.parse(readFileSync(join(root, "package-lock.json"))).packages["node_modules/next"].version;
  const nextApp = JSON.parse(readFileSync(join(bobineRoot, "frontend/package-lock.json"))).packages["node_modules/next"].version;
  const cargo = readFileSync(join(bobineRoot, "assistant/Cargo.lock"), "utf8");
  const tauri = cargo.match(/name = "tauri"\nversion = "([^"]+)"/)?.[1];
  if (!tauri) throw new Error("Version Tauri verrouillée absente");
  const definitions = [
    ...[...new Set([next, nextApp])].map(version => ({ framework: "nextjs", version, repo: "https://github.com/vercel/next.js.git", ref: `refs/tags/v${version}`, paths: ["docs"] })),
    { framework: "tauri", version: tauri, repo: "https://github.com/tauri-apps/tauri-docs.git", ref: "HEAD", paths: ["src/content/docs"] },
    { framework: "ffmpeg", version: "8.0.1", repo: "https://github.com/FFmpeg/FFmpeg.git", ref: "refs/tags/n8.0.1", paths: ["doc/ffmpeg.texi", "doc/ffprobe.texi", "doc/encoders.texi", "doc/decoders.texi", "doc/filters.texi", "doc/hwaccels.texi"] },
    ...["1.10.26", "2.14.1"].map(version => ({ framework: "pydantic", version, repo: "https://github.com/pydantic/pydantic.git", ref: `refs/tags/v${version}`, paths: ["docs"] })),
    ...["0.99.1", "0.143.3", "0.162.0"].map(version => ({ framework: "fastapi", version, repo: "https://github.com/fastapi/fastapi.git", ref: `refs/tags/${version}`, paths: ["docs/en/docs"] })),
    { framework: "systemd", version: "259", repo: "https://github.com/systemd/systemd.git", ref: "refs/tags/v259", paths: ["man/systemd.service.xml", "man/systemd.unit.xml", "man/systemd.timer.xml", "man/systemctl.xml", "man/journalctl.xml"] },
  ];
  const file = join(root, "scripts/rag/sources.lock.json");
  const previous = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { sources: [] };
  const sources = definitions.map(source => {
    const old = previous.sources.find(s => s.framework === source.framework && s.version === source.version && s.ref === source.ref);
    return { ...source, commit: old?.commit || resolveCommit(source.repo, source.ref) };
  });
  const lock = { format: 1, note: "Next.js et Tauri suivent les verrous du projet. Python : cibles documentaires explicites, dont Android. FFmpeg/systemd : références versionnées ; les versions déployées varient selon l’OS. Tauri-docs est un instantané figé compatible avec la majeure 2, sans promesse d’alignement exact sur un patch du runtime.", sources,
    references: [
      { framework: "linux", version: "reference", url: "https://www.debian.org/doc/debian-policy/" },
      { framework: "linux", version: "reference", url: "https://docs.fedoraproject.org/en-US/packaging-guidelines/" },
      { framework: "linux", version: "reference", url: "https://wiki.archlinux.org/title/PKGBUILD" },
    ] };
  writeFileSync(file, JSON.stringify(lock, null, 2) + "\n");
  return lock;
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name === ".git" ? [] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
export async function exportUpstream(root, bobineRoot) {
  const lock = refreshLock(root, bobineRoot);
  const cache = process.env.RAG_CACHE_DIR || join(homedir(), ".cache/bobine-rag");
  mkdirSync(cache, { recursive: true });
  const docs = [];
  for (const source of lock.sources) {
    const dir = join(cache, source.commit);
    if (!existsSync(join(dir, ".ready"))) {
      mkdirSync(dir, { recursive: true });
      if (!existsSync(join(dir, ".git"))) { git(["init", "-q"], dir); git(["remote", "add", "origin", source.repo], dir); }
      git(["sparse-checkout", "set", "--no-cone", ...source.paths.map(p => `/${p}`)], dir);
      git(["-c", "protocol.version=2", "fetch", "--filter=blob:none", "--depth=1", "origin", source.commit], dir);
      git(["checkout", "--detach", "FETCH_HEAD"], dir);
      writeFileSync(join(dir, ".ready"), source.commit);
    }
    let count = 0;
    for (const file of walk(dir)) {
      const relative = file.slice(dir.length + 1);
      if (!source.paths.some(p => relative === p || relative.startsWith(p + "/"))) continue;
      if (!/\.(md|mdx|texi|xml)$/.test(file) || /\/(zh-cn|zh-tw|ja|ko|es|de|ru|pt-br|fr|it|uk)\//.test(relative)) continue;
      const text = readFileSync(file, "utf8");
      if (!text.trim()) continue;
      docs.push({ key: `${source.framework}/${source.version}/${relative}`, framework: source.framework, version: source.version,
        source_revision: source.commit, locale: "en", platform: "doc", title: `${source.framework} ${source.version} — ${relative}`,
        source_url: `${source.repo.replace(/\.git$/, "")}/blob/${source.commit}/${relative}`, text });
      count++;
    }
    if (!count) throw new Error(`Corpus vide : ${source.framework} ${source.version}`);
    console.log(`${source.framework} ${source.version} : ${count} documents, révision ${source.commit.slice(0, 12)}`);
  }
  for (const ref of lock.references) {
    const response = await fetch(ref.url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Référence inaccessible : ${ref.url} HTTP ${response.status}`);
    const html = await response.text();
    const text = plainSnippet(html);
    if (text.length < 1000) throw new Error(`Référence incomplète : ${ref.url}`);
    docs.push({ key: ref.url, framework: ref.framework, version: ref.version, locale: "en", platform: "doc",
      title: `Linux packaging — ${new URL(ref.url).hostname}`, source_url: ref.url, text,
      source_revision: sha(text) });
  }
  return docs;
}
