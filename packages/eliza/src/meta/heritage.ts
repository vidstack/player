/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default */

import { isUndefined } from '@vidstack/foundation';
import LRUCache from 'lru-cache';
import type {
  __String,
  ArrowFunction,
  CallExpression,
  ClassDeclaration,
  ClassExpression,
  Declaration,
  ExpressionWithTypeArguments,
  FunctionDeclaration,
  HeritageClause,
  Identifier,
  InterfaceDeclaration,
  Node,
  TypeAliasDeclaration,
  TypeChecker,
  VariableDeclaration,
} from 'typescript';
import ts from 'typescript';

import { type Plugin } from '../plugins/Plugin';
import {
  type ComponentMeta,
  HeritageKind,
  type HeritageMeta,
  type InterfaceMeta,
  type MethodMeta,
  type PropMeta,
} from './component';
import { getDocTags } from './doc-tags';
import { getDocumentation } from './docs';
import { buildMethodMeta } from './method';
import { buildPropMeta, getPropTypeInfo } from './property';
import { buildSourceMeta } from './source';
import { getTypeSourceFile } from './type';

export const IGNORE_HERITAGE = new Set(['HTMLElement', 'LitElement']);

const heritageDeclarationCache = new LRUCache<string, HeritageMeta>({ max: 1024 });
export async function buildHeritageMetaTree(
  checker: TypeChecker,
  plugin: Plugin,
  heritages: HeritageMeta[],
  parent?: HeritageMeta,
): Promise<HeritageMeta[]> {
  if (isUndefined(plugin.build)) return [];

  const chain: HeritageMeta[] = [];

  await Promise.all(
    heritages
      .filter((heritage) => !IGNORE_HERITAGE.has(heritage.name))
      .map(async (heritage) => {
        const declaration = getHeritageDeclaration(heritage, checker);
        if (isUndefined(declaration)) return;

        const cacheKey = declaration.getText();

        if (heritageDeclarationCache.has(cacheKey)) {
          chain.push(heritageDeclarationCache.get(cacheKey)!);
          return;
        }

        let meta: HeritageMeta;

        // Class.
        if (ts.isClassDeclaration(declaration)) {
          meta = await buildClassHeritageMeta(checker, plugin, heritage, declaration);
        }
        // Interface.
        else if (ts.isTypeAliasDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) {
          meta = await buildInterfaceHeritageMeta(checker, plugin, heritage, declaration, parent);
        }
        // Mixin.
        else if (ts.isVariableDeclaration(declaration) || ts.isFunctionDeclaration(declaration)) {
          meta = await buildMixinHeritageMeta(checker, plugin, heritage, declaration);
        }

        // @ts-expect-error - assigned
        if (meta) {
          chain.push(meta);
          heritageDeclarationCache.set(cacheKey, meta);
        }
      }),
  );

  return chain;
}

export async function buildClassHeritageMeta(
  checker: TypeChecker,
  plugin: Plugin,
  heritage: HeritageMeta,
  declaration: ClassDeclaration | ClassExpression,
): Promise<HeritageMeta> {
  const component = (await buildComponentMetaWithHeritage(checker, plugin, declaration, heritage))!;
  return {
    ...heritage,
    component,
  };
}

export async function buildMixinHeritageMeta(
  checker: TypeChecker,
  plugin: Plugin,
  heritage: HeritageMeta,
  declaration: VariableDeclaration | FunctionDeclaration,
): Promise<HeritageMeta> {
  const body = ts.isVariableDeclaration(declaration)
    ? (declaration.initializer as ArrowFunction).body
    : declaration.body!;

  const mixin = ts.forEachChild(body, (node) => {
    if (ts.isClassDeclaration(node)) return node;

    if (ts.isReturnStatement(node) && ts.isClassExpression(node.expression!)) {
      return node.expression;
    }

    return undefined;
  });

  const mixinMeta = mixin
    ? (await buildComponentMetaWithHeritage(checker, plugin, mixin, heritage))!
    : undefined;

  return {
    ...heritage,
    mixin: mixinMeta,
  };
}

export async function buildInterfaceHeritageMeta(
  checker: TypeChecker,
  plugin: Plugin,
  heritage: HeritageMeta,
  declaration: TypeAliasDeclaration | InterfaceDeclaration,
  parent?: HeritageMeta,
): Promise<HeritageMeta> {
  const props: PropMeta[] = [];
  const methods: MethodMeta[] = [];
  const heritages = ts.isInterfaceDeclaration(declaration)
    ? buildHeritageMeta(checker, declaration, parent)
    : [];

  // Follow interface heritages all the way up.
  heritages
    .map((h) => getHeritageDeclaration(h, checker))
    .filter((d) => !isUndefined(d) && ts.isInterfaceDeclaration(d))
    .map((d) =>
      buildHeritageMetaTree(
        checker,
        plugin,
        buildHeritageMeta(checker, d! as InterfaceDeclaration, heritage),
        heritage,
      ),
    );

  // TODO: handle this case by finding and unpacking type references.
  if (ts.isTypeAliasDeclaration(declaration)) {
    // ...
  }

  function findSignatures(node: Node) {
    if (ts.isPropertySignature(node)) {
      props.push(buildPropMeta(checker, node));
      return;
    }

    if (ts.isMethodSignature(node)) {
      methods.push(buildMethodMeta(checker, node));
      return;
    }

    ts.forEachChild(node, findSignatures);
  }

  ts.forEachChild(declaration, findSignatures);

  return {
    ...heritage,
    interface: {
      node: declaration,
      source: buildSourceMeta(declaration),
      props,
      methods,
      heritage: heritages,
      docTags: getDocTags(declaration),
      documentation: getDocumentation(checker, declaration.name as Identifier),
    },
  };
}

export function getHeritageDeclaration(
  heritage: HeritageMeta,
  checker: TypeChecker,
): Declaration | undefined {
  const type = checker.getTypeAtLocation(heritage.node);
  const sourceFile = getTypeSourceFile(type);
  const fileSymbol = checker.getSymbolAtLocation(sourceFile)!;
  const symbol = fileSymbol?.exports?.get(heritage.name as __String);
  return symbol?.getDeclarations()?.[0];
}

const heritageCache = new LRUCache<string, HeritageMeta[]>({ max: 1024 });
export function buildHeritageMeta(
  checker: TypeChecker,
  declaration: ClassDeclaration | ClassExpression | InterfaceDeclaration,
  parent?: HeritageMeta,
): HeritageMeta[] {
  const cacheKey = declaration.getText();

  if (heritageCache.has(cacheKey)) return heritageCache.get(cacheKey)!;

  const heritage: HeritageMeta[] = [];

  const clauseToMeta = (node: ExpressionWithTypeArguments | Identifier | CallExpression) => {
    if (ts.isIdentifier(node)) {
      const isParentHeritageClause = ts.isHeritageClause(node.parent.parent);
      const isParentCallExpression = ts.isCallExpression(node.parent);
      const isBaseMixinClass =
        isParentCallExpression && (node.parent as CallExpression).expression !== node;
      const symbol = checker.getSymbolAtLocation(node)!;
      const clauseDeclaration = symbol.getDeclarations?.()?.[0];

      if (ts.isParameter(clauseDeclaration!)) {
        return;
      }

      const kind = isParentCallExpression
        ? isBaseMixinClass
          ? HeritageKind.Subclass
          : HeritageKind.Mixin
        : isParentHeritageClause &&
          (node.parent.parent as HeritageClause).token === ts.SyntaxKind.ImplementsKeyword
        ? HeritageKind.Interface
        : HeritageKind.Subclass;

      const name = node.escapedText.toString();
      const type = checker.getTypeAtLocation(node);

      heritage.push({
        name,
        node,
        kind,
        parent,
        documentation: getDocumentation(checker, node),
        typeInfo: getPropTypeInfo(checker, node, type),
      });
    } else if (ts.isExpressionWithTypeArguments(node)) {
      clauseToMeta(node.expression as Identifier | CallExpression);
    } else if (ts.isCallExpression(node)) {
      clauseToMeta(node.expression as Identifier);
      if (node.arguments[0]) clauseToMeta(node.arguments[0] as CallExpression);
    }
  };

  const heritageClauses = declaration.heritageClauses ?? ts.factory.createNodeArray();

  heritageClauses.forEach((clause) => {
    clause.types.forEach((node) => {
      clauseToMeta(node);
    });
  });

  heritageCache.set(cacheKey, heritage);
  return heritage;
}

export async function buildComponentMetaWithHeritage(
  checker: TypeChecker,
  plugin: Plugin,
  declaration: ClassDeclaration | ClassExpression,
  parent?: HeritageMeta,
) {
  if (isUndefined(plugin.build)) return null;

  const component = await plugin.build(declaration);

  if (!component) return null;

  component.heritage = [
    ...(component.heritage ?? []),
    ...(await buildHeritageMetaTree(
      checker,
      plugin,
      buildHeritageMeta(checker, declaration, parent),
    )),
  ];

  return component;
}

export function traverseHeritageTree(
  heritages: HeritageMeta[],
  callback: (heritage: HeritageMeta) => void,
): void {
  heritages.forEach((heritage) => {
    callback(heritage);

    let next: ComponentMeta | InterfaceMeta | undefined;

    if (!isUndefined(heritage.component)) {
      next = heritage.component;
    } else if (!isUndefined(heritage.interface)) {
      next = heritage.interface;
    } else if (!isUndefined(heritage.mixin)) {
      next = heritage.mixin;
    }

    if (!isUndefined(next?.heritage) && next!.heritage.length > 0) {
      traverseHeritageTree(next!.heritage, callback);
    }
  });
}
