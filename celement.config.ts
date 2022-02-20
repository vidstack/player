/* eslint-disable import/default, import/no-named-as-default-member */

import {
  ComponentMeta,
  EventMeta,
  litPlugin,
  type Plugin,
  vscodeHtmlDataPlugin
} from '@celement/cli';
import {
  getDocTags,
  getDocumentation,
  getPropTypeInfo,
  hasDocTag
} from '@celement/cli/dist/utils/meta.js';
import { escapeQuotes } from '@celement/cli/dist/utils/string.js';
import { readFileSync } from 'fs';
import prettier from 'prettier';
import type { Identifier, TypeChecker } from 'typescript';
import ts from 'typescript';
import path from 'upath';

const AUTO_GEN_COMMENT = '// [@celement/cli] AUTO GENERATED BELOW';

const pkgContent = readFileSync(
  path.resolve(process.cwd(), './package.json')
).toString();
const pkg: Record<string, any> = JSON.parse(pkgContent);

export default [
  litPlugin(),
  vscodeHtmlDataPlugin({
    transformAttributeData(prop, data) {
      const refs = (data.references ??= []);

      prop.docTags
        .filter((tag) => tag.name === 'link' && tag.text)
        .forEach((tag) => {
          const w3c = tag.text!.includes('w3c.github') ? 'W3C' : undefined;

          const mdn = tag.text!.includes('developer.mozilla')
            ? 'MDN'
            : undefined;

          refs.push({ name: w3c ?? mdn ?? 'Link', url: tag.text! });
        });

      if (refs.length > 0) data.references = refs;

      return data;
    }
  }),
  vdsEventsPlugin(),
  vdsReactPlugin()
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

  const eventsCache = new Map<string, EventMeta[]>();

  function addEventMeta(component: ComponentMeta, eventMeta: EventMeta) {
    const hasEvent = component.events.find(
      (event) => event.name === eventMeta.name
    );

    if (hasEvent) return;

    component.events.push(eventMeta);
  }

  return {
    name: '@vidstack/events',
    async init(program) {
      checker = program.getTypeChecker();
    },
    async postlink(components, sourceFiles) {
      for (const component of components) {
        const events = component.docTags
          .filter((tag) => tag.name === 'events' && tag.text)
          .map((tag) => [
            path.resolve(tag.node.getSourceFile().fileName),
            escapeQuotes(tag.text!)
          ]);

        for (const [filePath, eventsPath] of events) {
          const eventsFilePath = path.resolve(
            path.dirname(filePath),
            eventsPath
          );

          if (eventsCache.has(eventsFilePath)) {
            eventsCache.get(eventsFilePath)?.forEach((event) => {
              addEventMeta(component, event);
            });

            continue;
          }

          const sourceFile = sourceFiles.find(
            (file) => file.fileName === eventsFilePath
          );

          if (!sourceFile) continue;

          const foundEvents: EventMeta[] = [];

          sourceFile?.forEachChild((node) => {
            if (
              ts.isTypeAliasDeclaration(node) &&
              (ts.isTypeLiteralNode(node.type) ||
                ts.isIntersectionTypeNode(node.type))
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

                  if (
                    !isVdsEvent ||
                    !member.type ||
                    !ts.isTypeReferenceNode(member.type)
                  ) {
                    return;
                  }

                  const eventType = checker.getTypeAtLocation(member.type)
                    .aliasSymbol?.declarations?.[0];

                  if (!eventType || !ts.isTypeAliasDeclaration(eventType))
                    return;

                  const docTags = getDocTags(eventType);
                  const bubbles = hasDocTag(docTags, 'bubbles');
                  const composed = hasDocTag(docTags, 'composed');
                  const internal = hasDocTag(docTags, 'internal');
                  const deprecated = hasDocTag(docTags, 'deprecated');
                  const documentation = getDocumentation(
                    checker,
                    eventType.name
                  );

                  const event: EventMeta = {
                    name,
                    node: member,
                    docTags,
                    bubbles,
                    composed,
                    internal,
                    deprecated,
                    documentation,
                    typeInfo: getPropTypeInfo(checker, member, type)
                  };

                  addEventMeta(component, event);
                  foundEvents.push(event);
                }
              });
            }
          });

          eventsCache.set(eventsFilePath, foundEvents);
        }
      }

      return components;
    }
  };
}

function vdsReactPlugin(): Plugin {
  return {
    name: '@vidstack/react',
    async transform(components, utils) {
      const INDEX_FILE = path.resolve(process.cwd(), 'src/react/index.ts');
      const OUTPUT_DIR = path.resolve(process.cwd(), 'src/react/components');

      const index: string[] = [];

      for (const component of components) {
        const { className, source } = component;

        const displayName = className.replace('Element', '');
        const relativePath = path.relative(OUTPUT_DIR, source.dirPath);

        const events: string[] = [];
        for (const event of component.events) {
          const linkTags = event.docTags
            .filter((tag) => tag.name === 'link')
            .map((tag) => `@link ${tag.text}`)
            .join('\n');

          const docs = event.documentation
            ? `/**\n${event.documentation}${
                linkTags ? '\n\n' : ''
              }${linkTags}\n*/\n`
            : '';

          const reactEventName = `on${kebabToPascalCase(
            event.name.replace(/^vds-/, '')
          )}`;

          events.push(`${docs}${reactEventName}: '${event.name}',`);
        }

        const fileContent = `
          // [@celement/cli] THIS FILE IS AUTO GENERATED - SEE \`celement.config.ts\`

          import '../../define/${component.tagName}.ts';
          import * as React from 'react';
          import { createComponent } from './createComponent';
          import { ${component.className} } from '${relativePath}';

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
        const outputPath = path.resolve(OUTPUT_DIR, `${outputFileName}.ts`);

        utils.writeFileSync(
          outputPath,
          prettier.format(fileContent, {
            filepath: outputPath,
            ...pkg.prettier
          })
        );

        index.push(
          `export { default as ${displayName} } from './components/${outputFileName}';`
        );
      }

      const indexFileContent = utils.readFileSync(INDEX_FILE).toString();

      utils.writeFileSync(
        INDEX_FILE,
        [
          getUserContent(indexFileContent),
          AUTO_GEN_COMMENT,
          '',
          ...index,
          ''
        ].join('\n')
      );

      const rootReactDir = path.resolve(process.cwd(), 'react');

      if (!utils.existsSync(rootReactDir)) {
        utils.mkdirSync(rootReactDir);
      }

      utils.writeFileSync(
        path.resolve(rootReactDir, 'index.js'),
        "// This file only exists so it's easier for you to autocomplete the file path in your IDE."
      );
      utils.writeFileSync(
        path.resolve(rootReactDir, 'index.d.ts'),
        "export * from '../types/react';"
      );
    }
  };
}

function kebabToPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (t) => t.replace(/-/, '').toUpperCase());
}

function getUserContent(content: string) {
  return content.substring(0, content.indexOf(`\n${AUTO_GEN_COMMENT}`));
}
