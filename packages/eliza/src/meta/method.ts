/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default */

import { isUndefined } from '@vidstack/foundation';
import LRUCache from 'lru-cache';
import type { Identifier, MethodDeclaration, MethodSignature, TypeChecker } from 'typescript';
import ts from 'typescript';

import { type MethodMeta, type MethodTypeInfo } from './component';
import { getDocTags, hasDocTag } from './doc-tags';
import { getDocumentation } from './docs';
import { getPropTypeInfo } from './property';
import { typeTextFromTSType, typeToString } from './type';

const cache = new LRUCache<string, MethodMeta>({ max: 1024 });
export function buildMethodMeta(
  checker: TypeChecker,
  declaration: MethodDeclaration | MethodSignature,
): MethodMeta {
  const cacheKey = declaration.getText();

  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const method: Partial<MethodMeta> = {};

  const identifier = declaration.name as Identifier;
  const symbol = checker.getSymbolAtLocation(identifier);
  const name = symbol!.escapedName as string;
  const signature = checker.getSignatureFromDeclaration(declaration)!;
  const returnType = checker.getReturnTypeOfSignature(signature);

  const returnText = typeToString(checker, returnType);

  const signatureText = checker.signatureToString(
    signature,
    declaration,
    ts.TypeFormatFlags.WriteArrowStyleSignature | ts.TypeFormatFlags.NoTruncation,
    ts.SignatureKind.Call,
  );

  const isStatic =
    declaration.modifiers?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword) ?? false;

  const typeInfo: MethodTypeInfo = {
    signatureText,
    returnText,
  };

  const parameters = declaration.parameters.map((parameter) => ({
    node: parameter,
    name: (parameter.name as Identifier).escapedText as string,
    typeText: typeTextFromTSType(checker.getTypeAtLocation(parameter)),
    typeInfo: getPropTypeInfo(checker, parameter, checker.getTypeAtLocation(parameter)),
    optional: !isUndefined(parameter.questionToken),
    defaultValue: parameter.initializer?.getText(),
  }));

  method.node = declaration;
  method.name = name;
  method.static = isStatic;
  method.typeInfo = typeInfo;
  method.parameters = parameters;
  method.signature = signature;
  method.returnType = returnType;
  method.docTags = getDocTags(declaration);
  method.internal = hasDocTag(method.docTags, 'internal');
  method.deprecated = hasDocTag(method.docTags, 'deprecated');
  method.documentation = getDocumentation(checker, identifier);

  cache.set(cacheKey, method as MethodMeta);
  return method as MethodMeta;
}
