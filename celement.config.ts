/* eslint-disable import/default, import/no-named-as-default-member */

import {
  ComponentMeta,
  EventMeta,
  jsonPlugin,
  litPlugin,
  type Plugin,
  vscodeHtmlDataPlugin
} from '@celement/cli';
import {
  buildSourceMetaFromNode,
  getDocTags,
  getDocumentation,
  getPropTypeInfo,
  hasDocTag
} from '@celement/cli/dist/utils/meta.js';
import { escapeQuotes } from '@celement/cli/dist/utils/string.js';
import type { Identifier, TypeChecker } from 'typescript';
import ts from 'typescript';
import path from 'upath';

export default [
  litPlugin(),
  jsonPlugin(),
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
  vdsEventsPlugin()
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
          .map((tag) => [tag.source.filePath, escapeQuotes(tag.text!)]);

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
              ts.isTypeLiteralNode(node.type)
            ) {
              node.type.members.forEach((member) => {
                if (ts.isPropertySignature(member)) {
                  const identifier = member.name as Identifier;
                  const symbol = checker.getSymbolAtLocation(identifier)!;
                  const type = checker.getTypeAtLocation(member);
                  const name = symbol.escapedName as string;
                  const isVdsEvent = name.startsWith('vds');
                  const source = buildSourceMetaFromNode(member);

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
