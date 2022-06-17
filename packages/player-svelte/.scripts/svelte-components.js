import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const __cwd = process.cwd();

const AUTOGEN_COMMENT = '// THIS FILE IS AUTO GENERATED - SEE `.scripts/svelte-components.js`';

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
      const outputFileName = displayName;

      const slots = `['default', ${component.slots
        .map((slot) => slot.name.toLowerCase())
        .filter((slot) => slot !== 'default')
        .map((slot) => `'${slot}'`)
        .join(', ')}]`;

      const content = `${AUTOGEN_COMMENT}

import { ${component.className} } from '@vidstack/player';

import { createComponent } from '../lib';

declare global {
  interface HTMLElementTagNameMap {
    '${component.tagName}': ${component.className};
  }
}

export default  /* @__PURE__ */ createComponent('${component.tagName}', ${component.className}, ${slots});
`;

      for (const dir of OUTPUT_DIRS) {
        const filePath = path.resolve(dir, `${outputFileName}.ts`);
        await writeFile(filePath, content);
      }

      index.push(`export { default as ${displayName} } from './${outputFileName}';`);
    }),
  );

  for (const dir of OUTPUT_DIRS) {
    const filePath = path.resolve(dir, 'index.ts');
    fs.writeFileSync(filePath, [...index, ''].join('\n'));
  }
}

main();
