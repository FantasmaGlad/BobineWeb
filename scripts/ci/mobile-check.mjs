#!/usr/bin/env node
// Audit de géométrie sur le build servi : Chromium mesure des mises en page, pas du matériel Android.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const origin = process.env.MOBILE_CHECK_URL ?? "http://127.0.0.1:3102";
const port = 9337;
const profile = mkdtempSync(join(tmpdir(), "bobine-mobile-"));
const chrome = spawn(process.env.CHROME_BIN ?? "google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
chrome.on("error", (err) => { console.error(err); process.exitCode = 1; });
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
let socket;
try {
  let target;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); if (target) break; } catch { /* Le port n’est disponible qu’après l’initialisation du navigateur. */ }
    await delay(100);
  }
  if (!target) throw new Error("Chromium indisponible");
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
  await send("Page.enable");
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const failures = [];
  let measured = 0;
  const paths = process.env.MOBILE_CHECK_PATHS?.split(",") ?? ["/fr", "/en", "/fr/linux", "/en/linux", "/fr/documentation", "/en/documentation", "/fr/materiel/aliexpress", "/en/hardware/aliexpress", "/fr/materiel/amazon", "/en/hardware/amazon"];
  for (const path of paths) for (const width of [360, 390, 768, 1280]) {
    const response = await fetch(origin + path);
    if (!response.ok) throw new Error(`${path} : HTTP ${response.status}`);
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: true });
    await send("Page.navigate", { url: origin + path });
    for (let retry = 0; retry < 100; retry++) {
      if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) break;
      await delay(100);
    }
    if (!await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) throw new Error(`${path} : navigation non terminée`);
    await evaluate("document.fonts.ready");
    for (const theme of ["lavande", "orchidee"]) {
      await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}; new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
      await delay(700);
      const result = await evaluate(`(() => {
        const root = document.documentElement;
        const controls = [...document.querySelectorAll('button, a.button, a[class*="btn"], .site-header a, .site-footer a, .mobile-drawer a')].filter(e=>e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
        return { path: location.pathname, width: root.clientWidth, scroll: root.scrollWidth, coarse: matchMedia('(pointer:coarse)').matches, reducedMotion: matchMedia('(prefers-reduced-motion:reduce)').matches,
          overflow: [...document.querySelectorAll("body *")].flatMap(e=>{const r=e.getBoundingClientRect();return r.right>root.clientWidth+1 && r.width>0 && getComputedStyle(e).position!=="fixed" && ![...function*(n){for(let p=n.parentElement;p&&p!==document.body;p=p.parentElement)yield p;}(e)].some(p=>["hidden","clip","auto","scroll"].includes(getComputedStyle(p).overflowX))?[{tag:e.tagName,class:e.className,right:r.right}]:[];}).slice(0,20),
          small: controls.flatMap(e=>{ const r=e.getBoundingClientRect(); return r.width<43.9||r.height<43.9 ? [{tag:e.tagName, class:e.className, text:e.textContent.trim().slice(0,40), w:r.width,h:r.height}] : []; }) };
      })()`);
      measured++;
      if (result.scroll > width || result.width !== width || !result.coarse || !result.reducedMotion || result.small.length) failures.push({ path, width, theme, ...result });
    }
  }
  console.log(`G-MOBILE : ${measured} vues, 4 largeurs, 2 thèmes, pointeur grossier et mouvement réduit.`);
  if (failures.length) throw new Error(JSON.stringify(failures, null, 2));
} finally {
  socket?.close(); chrome.kill("SIGTERM");
  await new Promise((resolve) => chrome.exitCode !== null ? resolve() : chrome.once("exit", resolve));
  rmSync(profile, { recursive: true, force: true });
}
