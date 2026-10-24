import { readdir } from 'node:fs/promises';
import sharp from 'sharp';

// Un canal alpha déclaré ne suffit pas : il doit contenir des pixels transparents.
let checked = 0;
for (const directory of ['public/images', 'public/images/hardware', 'public/images/pdf']) {
  for (const name of await readdir(directory)) {
    if (!/-(cutout|transparent)\.(webp|png)$/.test(name)) continue;
    const file = `${directory}/${name}`;
    const metadata = await sharp(file).metadata();
    const stats = await sharp(file).stats();
    if (!metadata.hasAlpha || stats.channels.at(-1).min !== 0) {
      throw new Error(`Fond opaque : ${file}`);
    }
    checked += 1;
  }
}
if (!checked) throw new Error('Aucun visuel transparent contrôlé.');
console.log(`${checked} visuels avec transparence effective.`);
