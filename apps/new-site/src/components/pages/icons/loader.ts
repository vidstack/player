import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadIcons() {
  const iconsDir = path.resolve(process.cwd(), 'node_modules/media-icons/raw'),
    files = await fs.readdir(iconsDir),
    ignore = new Set(['.DS_Store']);

  const icons = {} as Record<string, string>;

  for (const file of files) {
    const name = path.basename(file, path.extname(file));

    if (ignore.has(name)) continue;

    const content = await fs.readFile(path.resolve(iconsDir, file), 'utf-8');

    icons[name] = content
      .replace(/<svg.*?\n/, '')
      .replace('\n</svg>', '')
      .trim();
  }

  return icons;
}
