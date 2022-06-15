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
import { createHash } from 'crypto';
import LRUCache from 'lru-cache';
import { relative, resolve } from 'path';
import type { Identifier, TypeChecker } from 'typescript';
import ts from 'typescript';

const __cwd = process.cwd();

const SRC_DIR = resolve(__cwd, 'src');

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
