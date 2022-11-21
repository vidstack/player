import { createJSONPlugin, createVSCodePlugin } from '@maverick-js/compiler/analyze';

export default [
  createJSONPlugin(),
  createVSCodePlugin({
    transformAttributeData(prop, data) {
      const refs = (data.references ??= []);

      prop.doctags
        ?.filter((tag) => tag.name === 'link' && tag.text)
        .forEach((tag) => {
          const w3c = tag.text!.includes('w3c.github') ? 'W3C' : undefined;
          const mdn = tag.text!.includes('developer.mozilla') ? 'MDN' : undefined;
          refs.push({ name: w3c ?? mdn ?? 'Link', url: tag.text! });
        });

      if (refs.length > 0) data.references = refs;

      return data;
    },
  }),
];
