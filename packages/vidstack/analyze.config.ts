import { readdirSync } from 'node:fs';
import path from 'node:path';

import { createJSONPlugin, createVSCodePlugin } from '@maverick-js/compiler/analyze';

export default [
  createJSONPlugin(),
  createVSCodePlugin({
    transformTagData(component, data) {
      const refs = (data.references ??= []);

      if (component.tag.name === 'media-icon') {
        const type = data.attributes.find((attr) => attr.name === 'type')!;
        const icons = readdirSync('node_modules/@vidstack/icons/raw');
        type.values = icons.map((name) => ({ name: path.basename(name, path.extname(name)) }));
      }

      component.doctags
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
          refs.push({ name: w3c ?? mdn ?? 'Documentation', url: tag.text! });
        });

      if (refs.length > 0) data.references = refs;

      return data;
    },
  }),
];
