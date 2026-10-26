#!/usr/bin/env node
import {pathToFileURL} from 'node:url';

/** Refuse chemins, identifiants, ports et domaines ressemblants avant tout appel authentifié. */
export function deploymentOrigin(value, mode='site') {
  const url=new URL(value);
  if(url.protocol!=='https:' || url.username || url.password || url.port || url.pathname!=='/' || url.search || url.hash)throw new Error('Une origine HTTPS sans chemin ni identifiants est exigée');
  const host=url.hostname;
  const allowed=mode==='security'?host==='security.bobine.fit':mode==='vercel'?/^bobine-[a-z0-9-]+-fantasmaglads-projects\.vercel\.app$/.test(host):host==='bobine.fit'||host.endsWith('.bobine.fit');
  if(!allowed)throw new Error(`Destination ${mode} non autorisée`);
  return url.origin;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try{console.log(deploymentOrigin(process.argv[2],process.argv[3]));}
  catch(error){console.error(error.message);process.exitCode=1;}
}
