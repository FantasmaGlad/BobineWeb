// Harnais Chrome DevTools Protocol partagé par les contrôles de géométrie (mobile-check, modal-check) : lance Chromium
// sans interface, lit son port dans DevToolsActivePort, expose send/evaluate et nettoie le profil à la fin.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), "bobine-cdp-"));
  const chrome = spawn(process.env.CHROME_BIN ?? "google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  let diagnostics = "";
  let launchError;
  chrome.stderr.on("data", (chunk) => { diagnostics = (diagnostics + chunk.toString()).slice(-6000); });
  chrome.on("error", (err) => { launchError = err; });
  let socket;
  const close = async () => {
    socket?.close(); chrome.kill("SIGTERM");
    if (chrome.pid) await new Promise((resolve) => chrome.exitCode !== null ? resolve() : chrome.once("exit", resolve));
    // Les processus fils de Chromium écrivent encore dans le profil un court instant après l'arrêt du parent : on
    // réessaie, et un nettoyage impossible ne doit pas masquer le verdict de la mesure.
    try { rmSync(profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 }); } catch (err) { console.warn(`Profil Chromium non supprimé : ${err.message}`); }
  };
  try {
    let target;
    for (let attempt = 0; attempt < 300; attempt++) {
      if (launchError) throw launchError;
      if (chrome.exitCode !== null) throw new Error(`Chromium arrêté (${chrome.exitCode}) : ${diagnostics}`);
      try {
        const port = Number(readFileSync(join(profile, "DevToolsActivePort"), "utf8").split("\n")[0]);
        target = (await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(1000) })).json()).find((t) => t.type === "page");
        if (target) break;
      } catch { /* Le port n’est disponible qu’après l’initialisation du navigateur. */ }
      await delay(100);
    }
    if (!target) throw new Error(`Chromium indisponible : ${diagnostics}`);
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let id = 0;
    const pending = new Map();
    socket.onmessage = ({ data }) => { const m = JSON.parse(data); if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); if (m.error) reject(new Error(m.error.message)); else resolve(m.result); } };
    const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); socket.send(JSON.stringify({ id: key, method, params })); });
    const evaluate = async (expression) => {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    return { send, evaluate, close };
  } catch (err) {
    await close();
    throw err;
  }
}
