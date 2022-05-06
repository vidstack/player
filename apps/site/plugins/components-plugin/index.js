import { readFileSync } from 'fs';
import { resolve } from 'path';

import { apiDocsPlugin } from './apiDocs.js';

const __cwd = process.cwd();

/** @type {import('@vidstack/eliza').ComponentMeta[]} */
const components = [];

try {
  const elementsPath = resolve(__cwd, 'node_modules/@vidstack/player/elements.json');
  const elements = getJson(elementsPath);
  components.push(...elements.components);
} catch (e) {
  // no-op
}

/**
 * @returns {import('vite').Plugin[]}
 */
export const componentsPlugin = () => [apiDocsPlugin(components)];

function getJson(filePath) {
  return JSON.parse(readFileSync(filePath).toString());
}
