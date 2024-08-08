import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chokidar from 'chokidar';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const STYLES_DIR = path.resolve(DIRNAME, '../styles'),
  BASE_STYLES_FILE = path.resolve(STYLES_DIR, 'player/base.css'),
  DEFAULT_THEME_DIR = path.resolve(STYLES_DIR, 'player/default'),
  DEFAULT_THEME_FILE = path.resolve(DEFAULT_THEME_DIR, 'theme.css');

export async function buildDefaultTheme() {
  // CSS merge.
  let styles = await fs.readFile(BASE_STYLES_FILE, 'utf-8'),
    themeDirFiles = await fs.readdir(DEFAULT_THEME_DIR, 'utf-8');

  for (const file of themeDirFiles) {
    if (file === 'theme.css' || file === 'layouts') continue;
    styles += '\n' + (await fs.readFile(path.resolve(DEFAULT_THEME_DIR, file), 'utf-8'));
  }

  await fs.writeFile(DEFAULT_THEME_FILE, styles);
}

export function watchStyles(onChange) {
  chokidar.watch(STYLES_DIR).on('all', async (_, path) => {
    if (path.endsWith('theme.css')) return;
    await buildDefaultTheme();
    onChange?.();
  });
}
