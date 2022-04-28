/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default */

import {
  type ComponentMeta,
  type EventMeta,
  getDocTags,
  getDocumentation,
  getPropTypeInfo,
  hasDocTag,
  jsonPlugin,
  type Plugin,
  vscodeHtmlDataPlugin,
} from '@vidstack/eliza';
import { kebabToPascalCase } from '@vidstack/foundation';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import LRUCache from 'lru-cache';
import { relative, resolve } from 'path';
import prettier from 'prettier';
import type { Identifier, TypeChecker } from 'typescript';
import ts from 'typescript';

const CWD = process.cwd();

const AUTO_GEN_COMMENT = '// [@vidstack/eliza] AUTO GENERATED BELOW';

const pkgContent = readFileSync(resolve(CWD, './package.json')).toString();
const pkg: Record<string, any> = JSON.parse(pkgContent);

const SRC_DIR = resolve(CWD, 'src');

export default [
  jsonPlugin({
    transformJson(data) {
      for (const component of data.components) {
        component.source = {
          // @ts-expect-error -
          dirPath: relative(SRC_DIR, component.source.dirPath),
          // @ts-expect-error -
          filePath: relative(SRC_DIR, component.source.filePath),
        };
      }

      return data;
    },
  }),
  vscodeHtmlDataPlugin({
    transformAttributeData(prop, data) {
      const refs = (data.references ??= []);

      prop.docTags
        .filter((tag) => tag.name === 'link' && tag.text)
        .forEach((tag) => {
          const w3c = tag.text!.includes('w3c.github') ? 'W3C' : undefined;
          const mdn = tag.text!.includes('developer.mozilla') ? 'MDN' : undefined;
          refs.push({ name: w3c ?? mdn ?? 'Link', url: tag.text! });
        });

      if (refs.length > 0) data.references = refs;

      return data;
    },
  }),
  vdsEventsPlugin(),
  vdsReactPlugin(),
  vdsSveltePlugin(),
];

/**
 * Event files are kept in file names ending with `*events.ts`. Elements in the library
 * can specify the events they dispatch by referencing a relative events file via a jsDoc tag
 * named `@events`. This plugin will resolve that file and parse the events declared through
 * type alias declarations.
 *
 * @example
 * ```ts
 * // FILE: events.ts
 *
 * // Type alias declaration
 * export type MyEvents = {
 *   'vds-some-event': SomeEvent;
 * }
 *
 * // This can include documentation, jsDoc tags, etc.
 * export type SomeEvent = VdsEvent<void>
 * ```
 */
function vdsEventsPlugin(): Plugin {
  let checker: TypeChecker;

  const cache = new LRUCache<string, EventMeta[]>({ max: 1024 });

  function addEventMeta(component: ComponentMeta, eventMeta: EventMeta) {
    const hasEvent = component.events.find((event) => event.name === eventMeta.name);
    if (hasEvent) return;
    component.events.push(eventMeta);
  }

  return {
    name: '@vidstack/player/events',
    async init(program) {
      checker = program.getTypeChecker();
    },
    async postlink(component, _, sourceFiles) {
      const events = component.docTags
        .filter((tag) => tag.name === 'events' && tag.text)
        .map((tag) => tag.text);

      for (const eventsFilePath of events) {
        const sourceFile = sourceFiles.find((file) => file.fileName === eventsFilePath);
        if (!sourceFile) continue;

        const cacheKey = createHash('sha256').update(sourceFile.text).digest('hex');

        if (cache.has(cacheKey)) {
          cache.get(cacheKey)?.forEach((event) => {
            addEventMeta(component, event);
          });

          continue;
        }

        const foundEvents: EventMeta[] = [];

        sourceFile.forEachChild((node) => {
          if (
            ts.isTypeAliasDeclaration(node) &&
            (ts.isTypeLiteralNode(node.type) || ts.isIntersectionTypeNode(node.type))
          ) {
            const members = ts.isTypeLiteralNode(node.type)
              ? node.type.members
              : node.type.types.flatMap((t) => {
                  if (ts.isTypeLiteralNode(t)) {
                    return t.members ?? [];
                  } else if (ts.isMappedTypeNode(t)) {
                    return t.members ?? [];
                  }

                  return [];
                });

            members.forEach((member) => {
              if (ts.isPropertySignature(member)) {
                const identifier = member.name as Identifier;
                const symbol = checker.getSymbolAtLocation(identifier)!;
                const type = checker.getTypeAtLocation(member);
                const name = symbol.escapedName as string;
                const isVdsEvent = name.startsWith('vds');

                if (!isVdsEvent || !member.type || !ts.isTypeReferenceNode(member.type)) {
                  return;
                }

                const eventType = checker.getTypeAtLocation(member.type).aliasSymbol
                  ?.declarations?.[0];

                if (!eventType || !ts.isTypeAliasDeclaration(eventType)) return;

                const docTags = getDocTags(eventType);
                const bubbles = hasDocTag(docTags, 'bubbles');
                const composed = hasDocTag(docTags, 'composed');
                const internal = hasDocTag(docTags, 'internal');
                const deprecated = hasDocTag(docTags, 'deprecated');
                const documentation = getDocumentation(checker, eventType.name);

                const event: EventMeta = {
                  name,
                  node: member,
                  docTags,
                  bubbles,
                  composed,
                  internal,
                  deprecated,
                  documentation,
                  typeInfo: getPropTypeInfo(checker, member, type),
                };

                addEventMeta(component, event);
                foundEvents.push(event);
              }
            });
          }
        });

        cache.set(cacheKey, foundEvents);
      }
    },
  };
}

function vdsReactPlugin(): Plugin {
  return {
    name: '@vidstack/player/react',
    async transform(components) {
      const INDEX_FILE = resolve(CWD, 'src/react/index.ts');
      const OUTPUT_DIR = resolve(CWD, 'src/react/components');

      if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR);
      }

      const index: string[] = [
        AUTO_GEN_COMMENT,
        '',
        "export * from '../index.js';",
        "export * from './lib/index.js';",
        '',
      ];

      for (const component of components) {
        const { className, source } = component;

        const displayName = className.replace('Element', '');
        const relativePath = relative(OUTPUT_DIR, source.dirPath);

        const events: string[] = [];
        for (const event of component.events) {
          const linkTags = event.docTags
            .filter((tag) => tag.name === 'link')
            .map((tag) => `@link ${tag.text}`)
            .join('\n');

          const docs = event.documentation
            ? `/**\n${event.documentation}${linkTags ? '\n\n' : ''}${linkTags}\n*/\n`
            : '';

          const reactEventName = `on${kebabToPascalCase(event.name.replace(/^vds-/, ''))}`;

          events.push(`${docs}${reactEventName}: '${event.name}',`);
        }

        const fileContent = `
          // [@vidstack/eliza] THIS FILE IS AUTO GENERATED - SEE \`eliza.config.ts\`

          import '../../define/${component.tagName}.js';
          import * as React from 'react';
          import { createComponent } from '../lib/index.js';
          import { ${component.className} } from '${relativePath}/index.js';

          const EVENTS = {${events.join('\n')}} as const

          /** ${component.documentation} */
          const ${displayName} = createComponent(
            React,
            '${component.tagName}',
            ${component.className},
            EVENTS,
            '${displayName}'
          );

          export default ${displayName};
        `;

        const outputFileName = displayName;
        const outputPath = resolve(OUTPUT_DIR, `${outputFileName}.ts`);

        writeFileFormattedSync(outputPath, fileContent);

        index.push(
          `export { default as ${displayName} } from './components/${outputFileName}.js';`,
        );
      }

      writeFileSync(INDEX_FILE, [...index, ''].join('\n'));

      const rootReactDir = resolve(CWD, 'react');

      if (!existsSync(rootReactDir)) {
        mkdirSync(rootReactDir);
      }

      writeFileSync(
        resolve(rootReactDir, 'index.js'),
        "// This file only exists so it's easier for you to autocomplete the file path in your IDE.",
      );
    },
  };
}

function vdsSveltePlugin(): Plugin {
  return {
    name: '@vidstack/player/svelte',
    async transform(components) {
      const CLIENT_INDEX_FILE = resolve(CWD, 'src/svelte/client/index.ts');
      const CLIENT_OUTPUT_DIR = resolve(CWD, 'src/svelte/client/components');
      const NODE_INDEX_FILE = resolve(CWD, 'src/svelte/node/index.ts');
      const NODE_OUTPUT_DIR = resolve(CWD, 'src/svelte/node/components');

      const INDEX_FILES = [CLIENT_INDEX_FILE, NODE_INDEX_FILE];
      const OUTPUT_DIRS = [CLIENT_OUTPUT_DIR, NODE_OUTPUT_DIR];

      for (const dir of OUTPUT_DIRS) {
        if (!existsSync(dir)) {
          mkdirSync(dir);
        }
      }

      const index: string[] = [
        AUTO_GEN_COMMENT,
        '',
        "export * from '../../index.js';",
        "export * from './lib/index.js';",
        '',
      ];

      for (const component of components) {
        const { className } = component;

        const displayName = className.replace('Element', '');
        const outputFileName = displayName;

        const slots = `['default', ${component.slots
          .map((slot) => slot.name.toLowerCase())
          .filter((slot) => slot !== 'default')
          .map((slot) => `'${slot}'`)
          .join(', ')}]`;

        const componentContent = (ssr: boolean) => `
          // [@vidstack/eliza] THIS FILE IS AUTO GENERATED - SEE \`eliza.config.ts\`
          ${ssr ? '' : `\nimport '../../../define/${component.tagName}.js';\n`}
          import { createComponent } from '../lib/index.js';

          export default createComponent('${component.tagName}', ${slots});
        `;

        for (const dir of OUTPUT_DIRS) {
          const outputPath = resolve(dir, `${outputFileName}.js`);
          const ssr = dir.includes('svelte/node');
          writeFileFormattedSync(outputPath, componentContent(ssr));
        }

        index.push(
          `export { default as ${displayName} } from './components/${outputFileName}.js';`,
        );
      }

      for (const indexFile of INDEX_FILES) {
        writeFileSync(indexFile, [...index, ''].join('\n'));
      }

      const rootSvelteDir = resolve(CWD, 'svelte');

      if (!existsSync(rootSvelteDir)) {
        mkdirSync(rootSvelteDir);
      }

      writeFileSync(
        resolve(rootSvelteDir, 'index.js'),
        "// This file only exists so it's easier for you to autocomplete the file path in your IDE.",
      );
    },
  };
}

function writeFileFormattedSync(filePath: string, content: string) {
  writeFileSync(filePath, format(filePath, content));
}

function format(filePath: string, content: string) {
  return prettier.format(content, {
    filepath: filePath,
    ...pkg.prettier,
  });
}
