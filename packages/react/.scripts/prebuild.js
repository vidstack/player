import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import { kebabToCamelCase, kebabToPascalCase } from 'maverick.js/std';

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  rootDir = path.resolve(__dirname, '..'),
  vidstackDir = path.resolve(rootDir, 'node_modules/vidstack');

async function copyStyles() {
  const stylesDir = path.resolve(vidstackDir, 'player/styles');
  await fs.copy(stylesDir, path.resolve(rootDir, 'player/styles'));
}

async function copyTailwind() {
  const tailwind = path.resolve(vidstackDir, 'tailwind.cjs'),
    tailwindDTS = path.resolve(vidstackDir, 'tailwind.d.cts');
  await fs.copyFile(tailwind, path.resolve(rootDir, 'tailwind.cjs'));
  await fs.copyFile(tailwindDTS, path.resolve(rootDir, 'tailwind.d.cts'));
}

async function buildIcons() {
  const iconsDir = path.resolve(rootDir, 'node_modules/media-icons/raw');
  const files = await fs.readdir(iconsDir, 'utf-8');
  const icons = {};
  const ignore = new Set(['.DS_Store']);

  for (const file of files) {
    if (ignore.has(file)) continue;
    const name = path.basename(file, path.extname(file));
    icons[name] = await fs.readFile(path.resolve(iconsDir, file), 'utf-8');
  }

  const outFile = path.resolve(rootDir, 'src/icons.ts');

  const svgPathImports = Object.keys(icons)
    .map((name) => kebabToCamelCase(name) + 'Paths')
    .join(',\n');

  const components = Object.keys(icons)
    .map((iconName) => {
      const IconName = kebabToPascalCase(iconName) + 'Icon';
      return (
        `/** [Click here to preview icon](https://vidstack.io/media-icons?lib=react&icon=${iconName}) */\n` +
        `export const ${IconName}: IconComponent = /* #__PURE__*/ forwardRef` +
        '((props, ref) => {\n' +
        `  return createElement(Icon, { ...props, ref, paths: ${
          kebabToCamelCase(iconName) + 'Paths'
        } });\n` +
        '});\n' +
        `${IconName}.displayName = 'Vidstack${IconName}';`
      );
    })
    .join('\n\n');

  await fs.writeFile(
    outFile,
    `import { ${svgPathImports} } from 'media-icons';
import { createElement, forwardRef } from 'react';

import { Icon, type IconComponent } from './icon';

${components}`,
  );
}

async function main() {
  await Promise.all([copyStyles(), copyTailwind(), buildIcons()]);
}

main();
