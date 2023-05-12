import { existsSync } from 'node:fs';
import fs, { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import kleur from 'kleur';
import { kebabToCamelCase, kebabToPascalCase } from 'maverick.js/std';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildComponents() {
  const elementsFile = path.resolve(__dirname, '../node_modules/vidstack/elements.json');

  if (!existsSync(elementsFile)) {
    console.warn(
      kleur.bold(
        kleur.yellow('\n`element.json` file does not exist, running `analyze` command...\n'),
      ),
    );
    await execa('npm', ['run', 'analyze'], {
      cwd: path.dirname(elementsFile),
      stdio: 'inherit',
    });
  }

  const imports = [];
  const content = [''];
  const ignore = new Set(['media-icon']);

  /** @type {import('vidstack/elements.json')['default']} */
  const elements = JSON.parse(await fs.readFile(elementsFile, 'utf-8')),
    components = elements.components;

  const outFile = path.resolve(__dirname, '../src/components.ts');

  const elementOpenRE = /<media-(.*?)(\s|\n|>)/g,
    elementCloseRE = /<\/media-(.*?)>/g,
    numberPropRE = /\s(\w*?)=\"(\d+)\"/g,
    booleanPropRE = /\s(\w*?)=\"(true|false)\"/g,
    kebabAttrRE = /(\w+\-\w+)?/g;

  for (const component of components) {
    if (ignore.has(component.tag.name)) continue;

    const elementName = `Media${component.name}Element`;
    imports.push(component.name);
    imports.push('type ' + elementName);

    const link = component.doctags
      ?.find((tag) => tag.name === 'docs')
      ?.text?.replace('.io/docs', '.io/docs/react');

    const examples = component.doctags
      ?.filter((tag) => tag.name === 'example' && tag.text)
      .map(
        (tag) =>
          '*' +
          tag.text
            ?.replace('```html', '```tsx')
            .replace(/<!--\s*(.*?)\s*-->/g, `$1`)
            .replace(elementOpenRE, (_, tag, ret) => '<Media' + kebabToPascalCase(tag) + ret)
            .replace(elementCloseRE, (_, tag) => '</Media' + kebabToPascalCase(tag) + '>')
            .replace(kebabAttrRE, (prop) => `${kebabToCamelCase(prop)}`)
            .replace(numberPropRE, (_, prop, value) => ` ${kebabToCamelCase(prop)}={${value}}`)
            .replace(booleanPropRE, (_, prop, value) => ` ${kebabToCamelCase(prop)}={${value}}`)
            .split('\n')
            .join('\n*'),
      );

    const docsLinkTag = link ? `\n\n* @docs {@link ${link}}` : '';

    const exampleTags = examples?.length
      ? `\n${examples.map((example) => `* @example\n${example}`).join('\n')}`
      : '';

    const name = `Media${component.name}`;

    content.push(
      `/**\n${component.docs}${docsLinkTag}${exampleTags}\n*/`,
      `export const ${name} = /* #__PURE__*/ createLiteReactElement<${name}Props>(${component.name});`,
      `export interface ${name}Props extends ReactElementProps<${elementName}> {};`,
      '',
    );
  }

  await fs.writeFile(
    outFile,
    [
      '// !!!!!!!!!!!!!!!!! DO NOT EDIT! This file is auto-generated. !!!!!!!!!!!!!!!!!',
      '',
      "import { createLiteReactElement, type ReactElementProps } from 'maverick.js/react';",
      'import {',
      ' ' + imports.join(',\n '),
      "} from 'vidstack';",
      ...content,
    ].join('\n'),
  );
}

async function buildIcons() {
  const iconsDir = path.resolve(__dirname, '../node_modules/media-icons/raw');
  const files = await readdir(iconsDir, 'utf-8');
  const icons = {};
  const ignore = new Set(['.DS_Store']);

  for (const file of files) {
    if (ignore.has(file)) continue;
    const name = path.basename(file, path.extname(file));
    icons[name] = await readFile(path.resolve(iconsDir, file), 'utf-8');
  }

  const outFile = path.resolve(__dirname, '../src/icons.ts');

  const svgPathImports = Object.keys(icons)
    .map((name) => kebabToCamelCase(name) + 'Paths')
    .join(',\n');

  const components = Object.keys(icons)
    .map(
      (iconName) =>
        `/** [Click here to preview icon](https://vidstack.io/media-icons?lib=react&icon=${iconName}) */\nexport const ${
          kebabToPascalCase(iconName) + 'Icon'
        }: IconComponent = /* #__PURE__*/ forwardRef` +
        '((props, ref) => {\n' +
        `  return createElement(Icon, { ...props, ref, __paths: ${
          kebabToCamelCase(iconName) + 'Paths'
        } });\n` +
        '});',
    )
    .join('\n\n');

  await writeFile(
    outFile,
    `import { ${svgPathImports} } from 'media-icons';
import { createElement, forwardRef } from 'react';

import { Icon, type IconComponent } from './icon';

${components}`,
  );
}

async function main() {
  await Promise.all([buildComponents(), buildIcons()]);
}

main();
