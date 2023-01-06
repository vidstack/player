import { execa } from 'execa';
import kleur from 'kleur';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
const components = JSON.parse(await fs.readFile(elementsFile, 'utf-8')).components;
const outFile = path.resolve(__dirname, '../src/components.ts');

for (const component of components) {
  const name = component.name.replace('Element', '');
  const defName = component.definition.name;
  definitions.push(defName);

  const category = component.file.path.match(/src\/player\/(.*?)\//)[1];

  const link = `https://www.vidstack.io/docs/player/react/components/${category}/${component.tag.name.replace(
    'vds-',
    '',
  )}`;

  content.push(
    `/**\n${component.docs}\n\n@see {@link ${link}}\n*/`,
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
