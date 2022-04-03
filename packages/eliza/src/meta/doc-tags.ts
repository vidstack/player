import { escapeQuotes, filterUnique } from '@vidstack/foundation';
import kleur from 'kleur';
import normalizePath from 'normalize-path';
import { dirname, resolve } from 'path';
import type { Node } from 'typescript';

import { LogLevel, reportDiagnosticByNode } from '../logger';
import type { DocTagMeta } from './component';

export function splitJsDocTagText(tag: DocTagMeta) {
  const [title, description] = (tag.text?.split(' - ') ?? []).map((s) => s.trim());

  return {
    title: !description ? undefined : title,
    description: !description ? title : description,
    node: tag.node,
  };
}

export function resolveDocTagText(node: Node, text?: string | Node[]) {
  // This resolves the case where a doc tag is nested (e.g., `@see {@link ...}`)
  if (typeof text === 'object') {
    // @ts-expect-error - .
    text = text.find((text) => !!text.name).text as string;
    return text?.startsWith('://') ? `https${text}` : text;
  }

  if (!text || !/^('|")?(\.\/|\.\.\/)/.test(text ?? '')) return text;

  const filePath = normalizePath(node.getSourceFile().fileName);
  const textPath = escapeQuotes(text);

  return resolve(dirname(filePath), textPath);
}

export const getDocTags = (node: Node): DocTagMeta[] =>
  ((node as any).jsDoc?.[0]?.tags ?? []).map((docTagNode: any) => ({
    node: docTagNode,
    name: docTagNode.tagName.escapedText,
    text: resolveDocTagText(node, docTagNode.comment),
  }));

export const findDocTag = (tags: DocTagMeta[], name: string): DocTagMeta | undefined =>
  tags.find((tag) => tag.name === name);

export const hasDocTag = (tags: DocTagMeta[], name: string): boolean =>
  tags.some((tag) => tag.name === name);

export function buildMetaFromDocTags(docTags: DocTagMeta[], tagName: string, example: string) {
  const tags = docTags.filter((tag) => tag.name === tagName).map((tag) => splitJsDocTagText(tag));

  return filterUnique(tags, 'title', {
    onDuplicateFound: (tag) => {
      reportDiagnosticByNode(
        `Found duplicate \`@${tagName}\` tags with the name \`${tag.title}\`.`,
        tag.node,
        LogLevel.Warn,
      );
    },
  }).map((tag) => {
    if (!tag.title) {
      reportDiagnosticByNode(
        [
          `Tag \`@${tagName}\` is missing a title.`,
          `\n${kleur.bold('EXAMPLE')}\n\n${example}`,
        ].join('\n'),
        tag.node,
        LogLevel.Warn,
      );
    }

    if (tag.title && !tag.description) {
      reportDiagnosticByNode(
        [
          `Tag \`@${tagName}\` is missing a description.`,
          `\n${kleur.bold('EXAMPLE')}\n\n${example}`,
        ].join('\n'),
        tag.node,
        LogLevel.Warn,
      );
    }

    return {
      name: tag.title ?? '',
      description: tag.description ?? '',
      node: tag.node,
    };
  });
}

export function mergeDocTags(tagsA: DocTagMeta[], tagsB: DocTagMeta[]) {
  const keysA = new Set(tagsA.map((tag) => tag.name + tag.text));
  for (const tagB of tagsB) {
    if (!keysA.has(tagB.name + tagB.text)) {
      tagsA.push(tagB);
    }
  }
}
