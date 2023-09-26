import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  createJSONPlugin,
  createVSCodePlugin,
  solidJSXTypesPlugin,
  svelteJSXTypesPlugin,
  vueJSXTypesPlugin,
  type AnalyzePlugin,
} from '@maverick-js/cli/analyze';

export default [
  createJSONPlugin(),
  createVSCodePlugin({
    transformTagData({ component }, data) {
      const refs = (data.references ??= []);

      component?.doctags
        ?.filter((tag) => (tag.name === 'docs' || tag.name === 'see') && tag.text)
        .forEach((tag) => {
          const w3c = tag.text!.includes('w3c.github') ? 'W3C' : undefined;
          const mdn = tag.text!.includes('developer.mozilla') ? 'MDN' : undefined;
          refs.push({ name: w3c ?? mdn ?? 'Documentation', url: tag.text! });
        });

      if (refs.length > 0) data.references = refs;

      return data;
    },
    transformAttributeData(prop, data) {
      const refs = (data.references ??= []);

      prop.doctags
        ?.filter((tag) => (tag.name === 'see' || tag.name === 'link') && tag.text)
        .forEach((tag) => {
          const w3c = tag.text!.includes('w3c.github') ? 'W3C' : undefined;
          const mdn = tag.text!.includes('developer.mozilla') ? 'MDN' : undefined;
          if (!refs.some((ref) => ref.url !== tag.text)) {
            refs.push({ name: w3c ?? mdn ?? 'Documentation', url: tag.text! });
          }
        });

      if (refs.length > 0) data.references = refs;

      return data;
    },
    transformOutput(output) {
      const icons = readdirSync('node_modules/media-icons/raw'),
        ignoredFiles = new Set(['.DS_Store']),
        iconValues = icons
          .filter((fileName) => !ignoredFiles.has(fileName))
          .map((fileName) => {
            const iconName = path.basename(fileName, path.extname(fileName));
            return {
              name: iconName,
              references: [
                {
                  name: 'Preview Icon',
                  url: `https://vidstack.io/media-icons?lib=html&icon=${iconName}`,
                },
              ],
            };
          });

      output.tags.push({
        name: 'media-icon',
        description:
          'This component dynamically loads and renders media icons. See our ' +
          '[media icons catalog](https://www.vidstack.io/media-icons) to preview them all. Do ' +
          'note, the icon `type` can be dynamically changed.',
        attributes: [{ name: 'type', values: iconValues }],
        references: [
          {
            name: 'Documentation',
            url: 'https://www.vidstack.io/docs/player/components/display/icons',
          },
        ],
      });
    },
  }),
  checkElementExports(),
  vueJSXTypesPlugin({
    imports: [`import type { IconType } from "./icons";`],
    components: [`"media-icon": HTMLAttributes & { type: IconType }`],
  }),
  svelteJSXTypesPlugin({
    imports: [`import type { IconType } from './icons';`],
    components: [
      `"media-icon": import('svelte/elements').HTMLAttributes<HTMLElement> & { type: IconType }`,
    ],
  }),
  solidJSXTypesPlugin({
    imports: [`import type { IconType } from "./icons";`],
    components: [`"media-icon": JSX.HTMLAttributes<HTMLElement> & { type: IconType };`],
  }),
];

function checkElementExports(): AnalyzePlugin {
  return {
    name: 'check-element-exports',
    async transform({ customElements }) {
      const exports = readFileSync('src/elements/index.ts', 'utf-8');
      for (const el of customElements) {
        if (!exports.includes(el.name)) {
          throw Error(`Missing element export \`${el.name}\` in module "src/elements/index.ts"`);
        }
      }
    },
  };
}
