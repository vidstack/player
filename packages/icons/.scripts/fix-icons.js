import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, '../raw');

async function main() {
  const files = await readdir(iconsDir);
  for (const file of files) {
    const filePath = path.resolve(iconsDir, file);
    const name = file.split(',')[0].slice('icon='.length);
    const content = (await readFile(filePath, 'utf8')).replace(
      /fill="#.*?"/g,
      'fill="currentColor"',
    );
    await rm(filePath);
    await writeFile(path.resolve(iconsDir, `${name}.svg`), content);
  }
}

main();
