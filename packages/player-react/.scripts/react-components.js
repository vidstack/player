import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const __cwd = process.cwd();

const AUTOGEN_COMMENT = '// THIS FILE IS AUTO GENERATED - SEE `.scripts/react-components.js`';

async function main() {
  /** @type {import('@vidstack/eliza').ComponentMeta[]} */
  const components = [];
  const elementsPath = path.resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
  const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));
  components.push(...elements.components);

  const COMPONENTS_DIR = path.resolve(__cwd, 'src/_components');

  if (!fs.existsSync(COMPONENTS_DIR)) fs.mkdirSync(COMPONENTS_DIR);

  /** @type {string[]} */
  const index = [AUTOGEN_COMMENT, ''];

  await Promise.all(
    components.map(async (component) => {
      const { className } = component;

      const displayName = className.replace('Element', '');
      const fileContent = `${AUTOGEN_COMMENT}

import { ${component.className} } from '@vidstack/player';
import * as React from 'react';

import { createComponent } from '../lib';

declare global {
  interface HTMLElementTagNameMap {
    '${component.tagName}': ${component.className};
  }
}

/** ${component.documentation} */
export default  /* @__PURE__ */ createComponent(React, '${component.tagName}', ${component.className});`;

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
