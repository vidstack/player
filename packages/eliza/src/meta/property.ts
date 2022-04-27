/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */

import { camelToKebabCase, isUndefined } from '@vidstack/foundation';
import LRUCache from 'lru-cache';
import type {
  EnumDeclaration,
  GetAccessorDeclaration,
  Identifier,
  LiteralType,
  ParameterDeclaration,
  PropertyDeclaration,
  PropertySignature,
  Type,
  TypeChecker,
} from 'typescript';
import ts from 'typescript';

import { LogLevel, reportDiagnosticByNode } from '../logger';
import {
  getDeclarationParameters,
  isDecoratedClassMember,
  isDecoratorNamed,
  isMemberPrivate,
} from '../utils';
import { type PropMeta, type PropTypeInfo } from './component';
import { findDocTag, getDocTags, hasDocTag } from './doc-tags';
import { getDocumentation } from './docs';
import { resolveType, typeTextFromTSType, typeToString } from './type';

export interface DefaultPropOptions {
  attribute?: string;
  reflect?: boolean;
}

const cache = new LRUCache<string, PropMeta>({ max: 1024 });
export function buildPropMeta<T>(
  checker: TypeChecker,
  declaration: PropertyDeclaration | GetAccessorDeclaration | PropertySignature,
  propDecoratorName = '',
  internalPropDecoratorName = '',
  transformPropOptions?: (propOptions: T) => DefaultPropOptions,
): PropMeta {
  const cacheKey = declaration.getText();

  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const prop: Partial<PropMeta> = {};

  const identifier = declaration.name as Identifier;
  const symbol = checker.getSymbolAtLocation(identifier)!;
  const type = checker.getTypeAtLocation(declaration);
  const typeDeclaration = type.aliasSymbol?.declarations?.[0];
  const name = symbol.escapedName as string;
  const isAccessor = ts.isGetAccessor(declaration);
  const decorator = declaration.decorators?.find(isDecoratorNamed(propDecoratorName));
  const decoratorParams = decorator ? getDeclarationParameters<T>(decorator) : undefined;
  const propOptions = decoratorParams?.[0] as T | undefined;
  const hasSetter = ts.isGetAccessor(declaration)
    ? (symbol.declarations?.length ?? 0) > 1
    : undefined;
  const isStatic =
    declaration.modifiers?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword) ?? false;

  const hasAttribute =
    (ts.isPropertyDeclaration(declaration) || ts.isGetAccessor(declaration)) &&
    isDecoratedClassMember(declaration) &&
    declaration.decorators!.find(isDecoratorNamed('property'));

  if (isMemberPrivate(declaration)) {
    reportDiagnosticByNode(
      [
        `Property \`${name}\` cannot be \`private\` or \`protected\`. Use the`,
        `\`@${internalPropDecoratorName}()\` decorator instead.`,
      ].join('\n'),
      declaration,
      LogLevel.Warn,
    );
  }

  const typeText = typeTextFromTSType(type);

  // @ts-expect-error - not sure how to cast declaration node to union typed node.
  const unionTypesText = type?.types?.map((type) => type.value).filter(Boolean);
  if (unionTypesText && unionTypesText.length > 0) prop.unionTypesText = unionTypesText;

  // Prop can have an attribute if type is NOT "unknown".
  if (
    hasAttribute &&
    (typeText !== 'unknown' || (isAccessor && hasSetter)) &&
    !isUndefined(propOptions) &&
    !isUndefined(transformPropOptions)
  ) {
    const { attribute, reflect } = transformPropOptions(propOptions);
    prop.attribute = attribute ? attribute.trim().toLowerCase() : undefined;
    prop.reflect = reflect ?? false;
  }

  prop.node = declaration;
  prop.name = name;
  prop.typeText = typeText;
  prop.static = isStatic;
  prop.typeInfo = getPropTypeInfo(checker, declaration, type);
  prop.documentation = getDocumentation(checker, identifier);
  prop.docTags = getDocTags(declaration);

  prop.readonly =
    (isAccessor && !hasSetter) ||
    (!hasSetter && hasDocTag(prop.docTags, 'readonly')) ||
    (declaration.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword) ??
      false);

  if (hasAttribute) {
    prop.attribute = !prop.readonly
      ? prop.attribute ?? camelToKebabCase(name)
      : findDocTag(prop.docTags, 'attribute')?.text;
  }

  prop.internal = hasDocTag(prop.docTags, 'internal');
  prop.deprecated = hasDocTag(prop.docTags, 'deprecated');

  prop.required =
    !isUndefined((declaration as PropertyDeclaration).exclamationToken) ||
    hasDocTag(prop.docTags, 'required');

  prop.optional = !isUndefined(declaration.questionToken) || hasDocTag(prop.docTags, 'optional');

  prop.defaultValue = ts.isPropertyDeclaration(declaration)
    ? declaration.initializer?.getText()
    : findDocTag(prop.docTags, 'defaultValue')?.text;

  prop.defaultValue = prop.defaultValue ?? (prop.optional ? 'undefined' : '');

  prop.enum = !isUndefined(typeDeclaration) && ts.isEnumDeclaration(typeDeclaration);

  prop.enumDeclaration = prop.enum ? (typeDeclaration as EnumDeclaration) : undefined;

  prop.enumDefaultValue =
    prop.enum &&
    ts.isPropertyDeclaration(declaration) &&
    !isUndefined(declaration.initializer) &&
    ts.isPropertyAccessExpression(declaration.initializer)
      ? String((checker.getTypeAtLocation(declaration.initializer) as LiteralType).value)
      : undefined;

  cache.set(cacheKey, prop as PropMeta);
  return prop as PropMeta;
}

export function getPropTypeInfo(
  typeChecker: TypeChecker,
  node:
    | PropertyDeclaration
    | ParameterDeclaration
    | PropertySignature
    | GetAccessorDeclaration
    | Identifier,
  type: Type,
): PropTypeInfo {
  const nodeType = (node as PropertyDeclaration).type;

  return {
    original: nodeType ? nodeType.getText() : typeToString(typeChecker, type),
    resolved: resolveType(typeChecker, type),
  };
}
