import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const CWD = process.cwd();

const TYPES_DIR = resolve(CWD, 'types/svelte/client/components');

const elementPath = resolve(CWD, 'elements.json');
const elements = JSON.parse(readFileSync(elementPath).toString());

/** @type {import('@vidstack/eliza').ComponentMeta[]} */
const components = elements.components;

for (const component of components) {
  const className = component.className;
  const displayName = component.className.replace('Element', '');

  const dtsContent = `
// [@vidstack/eliza] THIS FILE IS AUTO GENERATED - SEE \`eliza.config.ts\`

import { SvelteComponentTyped } from "svelte";
import { ${className} } from '../../../';

/** ${component.documentation} */
export default class ${displayName} extends SvelteComponentTyped<
  {
    id?: string;
    class?: string;
    style?: string;
    element?: ${className} | null;
    ${component.props
      .filter((prop) => !prop.readonly && !prop.internal)
      .map(
        (prop) =>
          `/** ${prop.documentation ?? ''} */\n  ${prop.name}?: ${className}['${prop.name}'];`,
      )
      .join('\n')}
  } & Partial<ARIAMixin>,
  GlobalEventHandlersEventMap,
  { default: {}; }
> {
  get element(): ${className} | null;
};

export {};
`;

  const dtsOutputPath = resolve(TYPES_DIR, `${displayName}.d.ts`);
  writeFileSync(dtsOutputPath, dtsContent);
}
