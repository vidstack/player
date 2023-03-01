import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');
const outDir = path.resolve(srcDir, 'icons');
const iconsDir = path.resolve(__dirname, '../raw');
const ignore = new Set(['.DS_Store']);

async function buildIcons() {
  if (existsSync(outDir)) await rm(outDir, { recursive: true });
  await mkdir(outDir);

  const icons = {};
  const files = await readdir(iconsDir);

  for (const file of files) {
    if (ignore.has(file)) continue;
    const fileName = path.basename(file, path.extname(file));
    const filePath = path.resolve(iconsDir, file);

    const content = (await readFile(filePath, 'utf8'))
      .replace(/<svg(.*?)>/, '')
      .replace('</svg>', '')
      .replace(/[\n\r\s\t]+/g, ' ')
      .trim();

    icons[fileName] = content;
    await writeFile(
      path.resolve(outDir, `${fileName}.ts`),
      `export default /* #__PURE__*/ \`${content}\` as string;`,
    );
  }

  await writeFile(
    path.resolve(outDir, 'index.ts'),
    [
      Object.keys(icons)
        .map((name, i) => `import Icon$${i} from "./${name}.js";`)
        .join('\n'),
      `export { ${Object.keys(icons)
        .map((name, i) => `Icon$${i} as ${kebabToCamelCase(name)}Paths`)
        .join(',\n')} }`,
      `export const paths: Record<string, string> = /* #__PURE__*/ {\n${Object.keys(icons)
        .map((name, i) => `"${name}": Icon$${i}`)
        .join(',\n')}\n};`,
      `export const lazyPaths: Record<string, (() => Promise<{default: string}>)> = /* #__PURE__*/ { ${Object.keys(
        icons,
      )
        .map((name) => `"${name}": () => import("./${name}.js")`)
        .join(',\n')} };`,
      `export type IconType = ${Object.keys(icons)
        .map((icon) => `"${icon}"`)
        .join('|')};`,
    ].join('\n\n'),
  );
}

function kebabToCamelCase(str) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}

buildIcons();
