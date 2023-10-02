import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { kebabToCamelCase, kebabToPascalCase } from 'maverick.js/std';

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  ROOT_DIR = path.resolve(__dirname, '..');

async function buildIcons() {
  const ICONS_DIR = path.resolve(ROOT_DIR, 'node_modules/media-icons/raw');

  const files = await fs.readdir(ICONS_DIR, 'utf-8'),
    icons = {},
    ignore = new Set(['.DS_Store']);

  for (const file of files) {
    if (ignore.has(file)) continue;
    const name = path.basename(file, path.extname(file));
    icons[name] = await fs.readFile(path.resolve(ICONS_DIR, file), 'utf-8');
  }

  const outFile = path.resolve(ROOT_DIR, 'src/icons.ts');

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
        `  return createElement(Icon, { ...props, className: cn(props.className), ref, paths: ${
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

const cn = (className?: string) => className ? \`\${className} vds-icon\` : 'vds-icon';

${components}`,
  );
}

await buildIcons();
