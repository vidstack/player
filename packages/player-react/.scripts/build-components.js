import fs from 'fs';
import path from 'path';
import { kebabToPascalCase } from '@vidstack/foundation';
import { writeFile } from 'fs/promises';

const __cwd = process.cwd();

/** @type {import('@vidstack/eliza').ComponentMeta[]} */
const components = [];
const elementsPath = path.resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));
components.push(...elements.components);

const AUTOGEN_COMMENT = '// THIS FILE IS AUTO GENERATED - SEE `.scripts/build-components.js`';

async function main() {
  const COMPONENTS_DIR = path.resolve(__cwd, 'src/_components');

  if (!fs.existsSync(COMPONENTS_DIR)) fs.mkdirSync(COMPONENTS_DIR);

  /** @type {string[]} */
  const index = [AUTOGEN_COMMENT, ''];

  await Promise.all(
    components.map(async (component) => {
      const { className } = component;

      const displayName = className.replace('Element', '');

      /** @type {string[]} */
      const events = [];

      for (const event of component.events) {
        const linkTags = event.docTags
          .filter((tag) => tag.name === 'link')
          .map((tag) => `@link ${tag.text}`)
          .join('\n');

        const docs = event.documentation
          ? `/**\n${event.documentation}${linkTags ? '\n\n' : ''}${linkTags}\n*/\n`
          : '';

        const reactEventName = `on${kebabToPascalCase(event.name.replace(/^vds-/, ''))}`;

        events.push(`${docs}${reactEventName}: '${event.name}',`);
      }

      const fileContent = `${AUTOGEN_COMMENT}

import '@vidstack/player/define/${component.tagName}';

import { ${component.className} } from '@vidstack/player';
import * as React from 'react';

import { createComponent } from '../lib';

const EVENTS = {${events.join('\n')}} as const

/** ${component.documentation} */
const ${displayName} = createComponent(
  React,
  '${component.tagName}',
  ${component.className},
  EVENTS,
  '${displayName}'
);

export default ${displayName};`;

      const outputFileName = displayName;
      const outputPath = path.resolve(COMPONENTS_DIR, `${outputFileName}.ts`);

      await writeFile(outputPath, fileContent);

      index.push(`export { default as ${displayName} } from './${outputFileName}';`);
    }),
  );

  index.push('');
  await writeFile(path.resolve(COMPONENTS_DIR, 'index.ts'), index.join('\n'));
}

main();
