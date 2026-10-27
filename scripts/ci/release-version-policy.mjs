import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

function parseVersion(value) {
  if (!/^\d+\.\d+\.\d+$/.test(value)) throw new Error(`Invalid product version: ${value}`);
  const parts = value.split('.').map(Number);
  if (!parts.every(Number.isSafeInteger)) throw new Error('Product version exceeds supported range');
  return parts;
}

export function checkReleaseVersions({ stableTag, taggedVersion, developmentVersion, announced }) {
  if (!/^V\d+\.\d+\.\d+$/.test(stableTag)) throw new Error('Expected a Stable tag Vx.y.z');
  const published = parseVersion(stableTag.slice(1));
  parseVersion(taggedVersion);
  const development = parseVersion(developmentVersion);
  if (taggedVersion !== stableTag.slice(1)) throw new Error('Published tag differs from VERSION at that tag');
  if (announced !== stableTag) throw new Error('Announced Stable differs from the published release');
  for (let index = 0; index < published.length; index += 1) {
    if (development[index] > published[index]) return 'development-ahead';
    if (development[index] < published[index]) throw new Error('Development VERSION predates the published Stable');
  }
  return 'aligned';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(checkReleaseVersions(JSON.parse(readFileSync(0, 'utf8'))));
  } catch (error) {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
