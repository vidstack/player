import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const __cwd = process.cwd();

async function main() {
  /** @type {import('@vidstack/eliza').ComponentMeta[]} */
  const components = [];
  const elementsPath = path.resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
  const elements = JSON.parse(fs.readFileSync(elementsPath, { encoding: 'utf-8' }));
  components.push(...elements.components);

  const TYPES_DIR = path.resolve(__cwd, 'types/client/_components');

  await Promise.all(
    components.map(async (component) => {
      const displayName = component.className.replace('Element', '');

      await writeFile(
        path.resolve(TYPES_DIR, `${displayName}.d.ts`),
        buildDtsFile(displayName, component),
      );
    }),
  );
}

function buildDtsFile(displayName, component) {
  const slotNames = component.slots
    .map((slot) => slot.name.toLowerCase())
    .filter((slot) => slot !== 'default');

  return `import type { SvelteComponentTyped } from "svelte";
import type { ${component.className} } from '@vidstack/player';

/** ${component.documentation} */
export default class ${displayName} extends SvelteComponentTyped<
  {
    id?: string;
    class?: string;
    style?: string;
    element?: ${component.className} | null;
    ${component.props
      .filter((prop) => !prop.readonly && !prop.internal)
      .map(
        (prop) =>
          `/** ${prop.documentation ?? ''} */\n  ${prop.name}?: ${component.className}['${
            prop.name
          }'];`,
      )
      .join('\n')}
  } & Partial<ARIAMixin>,
  HTMLElementEventMap,
  { default: {}; ${slotNames.map((slot) => `${slot}: {};`).join(' ')} }
> {
  get element(): ${component.className} | null;
};

export {};
`;
}

main();
