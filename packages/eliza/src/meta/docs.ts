/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default */

import { normalizeLineBreaks } from '@vidstack/foundation';
import type { Identifier, TypeChecker } from 'typescript';
import ts from 'typescript';

export function getDocumentation(checker: TypeChecker, id: Identifier): string {
  const comment = checker.getSymbolAtLocation(id)?.getDocumentationComment(checker);
  return normalizeLineBreaks(ts.displayPartsToString(comment) ?? '');
}
