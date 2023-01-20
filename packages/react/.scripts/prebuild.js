import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import kleur from 'kleur';
import { kebabToPascalCase } from 'maverick.js/std';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const definitions = [];
const content = [''];

/** @type {import('vidstack/elements.json')['default']} */
const elements = JSON.parse(await fs.readFile(elementsFile, 'utf-8')),
  components = elements.components;

const outFile = path.resolve(__dirname, '../src/components.ts');

const elementOpenRE = /<vds-(.*?)(\s|\n|>)/g,
  elementCloseRE = /<\/vds-(.*?)>/g;

for (const component of components) {
  const name = component.name.replace('Element', '');
  const defName = component.definition.name;
  definitions.push(defName);

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
          .replace(elementOpenRE, (_, m, m2) => '<' + kebabToPascalCase(m) + m2)
          .replace(elementCloseRE, (_, m) => '</' + kebabToPascalCase(m) + '>')
          .split('\n')
          .join('\n*'),
    );

  const docsLinkTag = link ? `\n\n* @docs {@link ${link}}` : '';

  const exampleTags = examples?.length
    ? `\n${examples.map((example) => `* @example\n${example}`).join('\n')}`
    : '';

  content.push(
    `/**\n${component.docs}${docsLinkTag}${exampleTags}\n*/`,
    `export const ${name} = createLiteReactElement(${defName});`,
    '',
  );
}

await fs.writeFile(
  outFile,
  [
    '// !!!!!!!!!!!!!!!!! DO NOT EDIT! This file is auto-generated. !!!!!!!!!!!!!!!!!',
    '',
    "import { createLiteReactElement } from 'maverick.js/react';",
    'import {',
    ' ' + definitions.join(',\n '),
    "} from 'vidstack';",
    ...content,
  ].join('\n'),
);
