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

  const CLIENT_OUTPUT_DIR = path.resolve(__cwd, 'src/client/_components');
  const NODE_OUTPUT_DIR = path.resolve(__cwd, 'src/node/_components');
  const OUTPUT_DIRS = [CLIENT_OUTPUT_DIR, NODE_OUTPUT_DIR];

  for (const dir of OUTPUT_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /** @type {string[]} */
  const index = [AUTOGEN_COMMENT, ''];

  await Promise.all(
    components.map(async (component) => {
      const { className } = component;

      const displayName = className.replace('Element', '');

      // ~~~ CLIENT ~~~
      const clientContent = `${AUTOGEN_COMMENT}\n
import { ${component.className} } from '@vidstack/player';
import * as React from 'react';

import { createComponent } from '../lib';

declare global {
  interface HTMLElementTagNameMap {
    '${component.tagName}': ${component.className};
  }
}

/** ${component.documentation} */
export default  /* @__PURE__ */ createComponent(React, '${component.tagName}', ${component.className});\n`;

      // ~~~ NODE ~~~
      const nodeContent = `${AUTOGEN_COMMENT}\n
import * as React from 'react';

import { createComponent } from '../lib';

export default  /* @__PURE__ */ createComponent(React, '${component.tagName}');\n`;

      const outputFileName = displayName;

      const clientPath = path.resolve(CLIENT_OUTPUT_DIR, `${outputFileName}.ts`);
      await writeFile(clientPath, clientContent);

      const nodePath = path.resolve(NODE_OUTPUT_DIR, `${outputFileName}.ts`);
      await writeFile(nodePath, nodeContent);

      if (component.tagName !== 'vds-media') {
        index.push(`export { default as ${displayName} } from './${outputFileName}';`);
      }
    }),
  );

  index.push('');

  for (const dir of OUTPUT_DIRS) {
    await writeFile(path.resolve(dir, 'index.ts'), index.join('\n'));
  }
}

main();
