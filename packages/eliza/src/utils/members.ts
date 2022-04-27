/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */

import type {
  ClassElement,
  Identifier,
  MethodSignature,
  Node,
  PropertySignature,
  TypeChecker,
} from 'typescript';
import ts from 'typescript';

export function getMemberName(checker: TypeChecker, node: ClassElement): string | undefined {
  const identifier = node.name as Identifier;
  const symbol = checker.getSymbolAtLocation(identifier);
  return symbol?.escapedName as string | undefined;
}

export const isMemberPrivate = (
  member: ClassElement | PropertySignature | MethodSignature,
): boolean =>
  !!member.modifiers &&
  member.modifiers.some(
    (m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword,
  );
