import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { createJSONPlugin, createVSCodePlugin, type AnalyzePlugin } from '@maverick-js/cli/analyze';

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
  vueTypesPlugin(),
  svelteTypesPlugin(),
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

function vueTypesPlugin(): AnalyzePlugin {
  return {
    name: 'vue-types',
    async transform({ components, customElements }) {
      const elementImports = customElements.map((el) => el.name),
        typeImports = customElements
          .map((el) => el.component?.name && components.find((c) => c.name === el.component!.name))
          .flatMap((c) => (c ? [c.generics?.props, c.generics?.events].filter(Boolean) : [])),
        globalComponents = customElements.map(
          (el) => `"${el.tag.name}": ${el.name.replace('Element', '') + 'Component'}`,
        );

      const dts = [
        "import type { HTMLAttributes, Ref, ReservedProps } from 'vue';",
        `import type { ${elementImports.join(', ')} } from './elements';`,
        `import type { ${unique(typeImports).join(', ')} } from './index';`,
        '',
        "declare module 'vue' {",
        '  export interface GlobalComponents {',
        `    ${globalComponents.join(';\n    ')}`,
        '  }',
        '}',
        '',
        'export type ElementRef<T> = string | Ref<T> | ((el: T | null) => void);',
        '',
        'export interface EventHandler<T> {',
        '  (event: T): void;',
        '}',
        ...customElements.map((el) => {
          const name = el.name.replace('Element', ''),
            component = components.find((c) => c.name === el.component?.name),
            propsType = component?.generics?.props,
            eventsType = component?.generics?.events,
            hasEvents = eventsType && component?.events?.length,
            attrsName = `${name}Attributes`,
            eventsAttrsName = `${name}EventAttributes`,
            omitHTMLAttrs = [
              propsType && `keyof ${propsType}`,
              hasEvents && `keyof ${eventsAttrsName}`,
              '"is"',
            ]
              .filter(Boolean)
              .join(' | '),
            _extends = [
              propsType && `Partial<${propsType}>`,
              hasEvents && eventsAttrsName,
              `Omit<HTMLAttributes, ${omitHTMLAttrs}>`,
              "Omit<ReservedProps, 'ref'>",
            ].filter(Boolean);
          return [
            '/**********************************************************************************************',
            `* ${name}`,
            '/**********************************************************************************************/',
            '',
            `export interface ${name}Component {`,
            `  (props: ${attrsName}): ${el.name};`,
            '}',
            '',
            `export interface ${attrsName} extends ${_extends.join(', ')} {`,
            `  ref?: ElementRef<${el.name}>;`,
            '}',
            '',
            ...(hasEvents
              ? [
                  `export interface ${eventsAttrsName} {`,
                  component
                    .events!.map(
                      (event) =>
                        `  on${kebabToPascalCase(event.name)}?: EventHandler<${eventsType}['${
                          event.name
                        }']>;`,
                    )
                    .join('\n'),
                  '}',
                ]
              : []),
            '',
          ].join('\n');
        }),
      ];

      writeFileSync('vue.d.ts', dts.join('\n'));
    },
  };
}

function svelteTypesPlugin(): AnalyzePlugin {
  return {
    name: 'svelte-types',
    async transform({ components, customElements }) {
      const elementImports = customElements.map((el) => el.name),
        typeImports = customElements
          .map((el) => el.component?.name && components.find((c) => c.name === el.component!.name))
          .flatMap((c) => (c ? [c.generics?.props, c.generics?.events].filter(Boolean) : [])),
        svelteElements = customElements.map(
          (el) => `"${el.tag.name}": ${el.name.replace('Element', '') + 'Attributes'}`,
        );

      const dts = [
        `import type { ${elementImports.join(', ')} } from './elements';`,
        `import type { ${unique(typeImports).join(', ')} } from './index';`,
        '',
        'declare global {',
        '  namespace svelteHTML {',
        '    interface IntrinsicElements {',
        `      ${svelteElements.join(';\n    ')}`,
        '    }',
        '  }',
        '}',
        '',
        'export interface EventHandler<T> {',
        '  (event: T): void;',
        '}',
        ...customElements.map((el) => {
          const name = el.name.replace('Element', ''),
            component = components.find((c) => c.name === el.component?.name),
            propsType = component?.generics?.props,
            eventsType = component?.generics?.events,
            hasEvents = eventsType && component?.events?.length,
            attrsName = `${name}Attributes`,
            eventsAttrsName = `${name}EventAttributes`,
            omitHTMLAttrs = [
              propsType && `keyof ${propsType}`,
              hasEvents && `keyof ${eventsAttrsName}`,
              '"is"',
            ]
              .filter(Boolean)
              .join(' | '),
            _extends = [
              propsType && `Partial<${propsType}>`,
              hasEvents && eventsAttrsName,
              `Omit<import('svelte/elements').HTMLAttributes<${el.name}>, ${omitHTMLAttrs}>`,
            ].filter(Boolean);
          return [
            '/**********************************************************************************************',
            `* ${name}`,
            '/**********************************************************************************************/',
            '',
            '',
            `export interface ${attrsName} extends ${_extends.join(', ')} {`,
            '}',
            '',
            ...(hasEvents
              ? [
                  `export interface ${eventsAttrsName} {`,
                  component
                    .events!.map((event) => {
                      const docs = event.docs
                        ? `/**\n${event.docs}\n${event.doctags
                            ?.map((tag) => `@${tag.name} ${tag.text}`)
                            .join('\n')}\n*/\n  `
                        : '';

                      return `  ${docs}"on:${event.name}"?: EventHandler<${eventsType}['${event.name}']>;`;
                    })
                    .join('\n'),
                  '}',
                ]
              : []),
            '',
          ].join('\n');
        }),
      ];

      writeFileSync('svelte.d.ts', dts.join('\n'));
    },
  };
}

function kebabToPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase();
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
