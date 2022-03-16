import type { ComponentMeta } from '@vidstack/eliza';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Plugin } from 'vite';

import { apiDocsPlugin } from './apiDocsPlugin';
import { headingsPlugin } from './headingsPlugin';

const CWD = process.cwd();
const components: ComponentMeta[] = [];

try {
  const elementsPath = resolve(CWD, 'node_modules/@vidstack/player/elements.json');
  const elements = getJson(elementsPath);
  components.push(...elements.components);
} catch (e) {
  // no-op
}

export const componentsPlugin = (): Plugin[] => [
  apiDocsPlugin(components),
  headingsPlugin(components),
];

function getJson(filePath) {
  return JSON.parse(readFileSync(filePath).toString());
}
