/* eslint-disable */
import ts from 'typescript';

export const getDocTags = (node) => (node.jsDoc?.[0]?.tags ?? [])
  .map((docTagNode) => ({
    node: docTagNode,
    name: docTagNode.tagName.escapedText,
    text: docTagNode.comment,
  }));

export const normalizeLineBreaks = text => text.replace(/\\r/g, '\n');

export function getDocumentation(checker, id) {
  const comment = checker
    .getSymbolAtLocation(id)
    ?.getDocumentationComment(checker);
  return normalizeLineBreaks(ts.displayPartsToString(comment) ?? '');
}