/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default */

import { escapeQuotes, isBoolean, isUndefined } from '@vidstack/foundation';
import type {
  CallExpression,
  ClassDeclaration,
  ClassExpression,
  GetAccessorDeclaration,
  Identifier,
  MethodDeclaration,
  Node,
  Program,
  PropertyDeclaration,
  SourceFile,
  TypeChecker,
} from 'typescript';
import ts from 'typescript';

import { getMemberName, isDecoratorNamed, isMemberPrivate } from '../utils';
import {
  type ComponentMeta,
  type CssPartMeta,
  type CssPropMeta,
  type DocTagMeta,
  type EventMeta,
  type MethodMeta,
  type PropMeta,
  type SlotMeta,
} from './component';
import { buildMetaFromDocTags, findDocTag, getDocTags, mergeDocTags } from './doc-tags';
import { getDocumentation } from './docs';
import { buildMethodMeta } from './method';
import { buildPropMeta } from './property';
import { RESERVED_PUBLIC_MEMBERS } from './reserved';
import { buildSlotMeta } from './slot';
import { buildSourceMeta } from './source';

export interface LitPropOptions {
  attribute?: string;
  reflect?: boolean;
}

export interface LitEventOptions {
  name?: string;
  bubbles?: boolean;
  composed?: boolean;
}

export const LIT_LIFECYCLE_METHODS = new Set([
  'createRenderRoot',
  'connectedCallback',
  'disconnectedCallback',
  'performUpdate',
  'shouldUpdate',
  'willUpdate',
  'update',
  'render',
  'firstUpdated',
  'updated',
]);

export function defaultDiscoverPlugin() {
  return {
    name: '@vidstack/eliza/discover',
    async discover(sourceFile: SourceFile) {
      function visit(node: Node) {
        if (ts.isClassDeclaration(node) && findTagName(node).length > 0) {
          return node;
        }

        return null;
      }

      return ts.forEachChild(sourceFile, visit);
    },
  };
}

export function defaultBuildPlugin() {
  let checker: TypeChecker;

  return {
    name: '@vidstack/eliza/build',
    async init(program: Program) {
      checker = program.getTypeChecker();
    },
    async build(declaration: ClassDeclaration | ClassExpression) {
      return buildComponentMeta(checker, declaration);
    },
  };
}

export function buildComponentMeta(
  checker: TypeChecker,
  declaration: ClassDeclaration | ClassExpression,
) {
  const identifier = declaration.name as Identifier;
  const source = buildSourceMeta(declaration);
  const docTags = getDocTags(declaration);
  return {
    node: declaration,
    source,
    documentation: getDocumentation(checker, identifier),
    className: identifier.escapedText as string,
    props: findProps(checker, declaration),
    methods: findMethods(checker, declaration),
    events: [],
    tagName: findTagName(declaration),
    docTags,
    cssProps: findCssProps(docTags),
    cssParts: findCssParts(docTags),
    slots: findSlots(docTags),
    heritage: [],
    dependencies: [],
    dependents: [],
  };
}

function findTagName(declaration: ClassDeclaration | ClassExpression): string {
  const customElDecorator = (declaration.decorators ?? []).find(isDecoratorNamed('customElement'));

  const tagName =
    (customElDecorator?.expression as CallExpression)?.arguments?.[0].getText() ??
    findDocTag(getDocTags(declaration), 'tagname')?.text;

  return escapeQuotes(tagName ?? '');
}

function findProps(
  checker: TypeChecker,
  declaration: ClassDeclaration | ClassExpression,
): PropMeta[] {
  return declaration.members
    .filter((node) => ts.isPropertyDeclaration(node) && !isMemberPrivate(node))
    .filter((node) => {
      const name = getMemberName(checker, node) ?? '';
      return !name.startsWith('_');
    })
    .map((node) =>
      buildPropMeta<LitPropOptions>(
        checker,
        node as PropertyDeclaration | GetAccessorDeclaration,
        'property',
        'internalProperty',
        (opts) => opts ?? {},
      ),
    );
}

function findMethods(
  checker: TypeChecker,
  declaration: ClassDeclaration | ClassExpression,
): MethodMeta[] {
  return declaration.members
    .filter((node) => ts.isMethodDeclaration(node))
    .filter((node) => !isMemberPrivate(node))
    .filter((node) => {
      const name = getMemberName(checker, node) ?? '';
      return !RESERVED_PUBLIC_MEMBERS.has(name) && !LIT_LIFECYCLE_METHODS.has(name);
    })
    .map((node) => buildMethodMeta(checker, node as MethodDeclaration));
}

function findCssProps(tags: DocTagMeta[]): CssPropMeta[] {
  return buildMetaFromDocTags(
    tags,
    'cssprop',
    '@cssprop --bg-color - The background color of this component.',
  );
}

function findCssParts(tags: DocTagMeta[]): CssPartMeta[] {
  return buildMetaFromDocTags(
    tags,
    'csspart',
    '@csspart container - The root container of this component.',
  );
}

function findSlots(tags: DocTagMeta[]): SlotMeta[] {
  return buildSlotMeta(tags);
}

export type ComponentMetaPartKey =
  | 'props'
  | 'docTags'
  | 'methods'
  | 'events'
  | 'cssProps'
  | 'cssParts'
  | 'dependencies';

export type ComponentMetaPart =
  | PropMeta
  | DocTagMeta
  | MethodMeta
  | EventMeta
  | CssPropMeta
  | CssPartMeta;

export const COMPONENT_META_PARTS: ComponentMetaPartKey[] = [
  'props',
  'docTags',
  'methods',
  'events',
  'cssProps',
  'cssParts',
  'dependencies',
];

export function mergeAllComponentParts(
  a: Pick<ComponentMeta, ComponentMetaPartKey>,
  b: Pick<ComponentMeta, ComponentMetaPartKey>,
) {
  for (const part of COMPONENT_META_PARTS) {
    mergeComponentPart(a, b, part);
  }
}

export function mergeComponentPart(
  a: Pick<ComponentMeta, ComponentMetaPartKey>,
  b: Pick<ComponentMeta, ComponentMetaPartKey>,
  part: ComponentMetaPartKey,
) {
  const partA = a[part] as ComponentMetaPart[];
  const partB = b[part] as ComponentMetaPart[];

  if (part === 'docTags') {
    mergeDocTags(partA, partB);
    return;
  }

  const aProps = new Map<string, ComponentMetaPart>();

  for (const prop of partA) {
    aProps.set(prop.name, prop);
  }

  for (const propB of partB) {
    if (aProps.has(propB.name)) {
      const propA = aProps.get(propB.name)!;
      Object.keys(propB).forEach((prop) => {
        const valueA = propA[prop];
        const valueB = propB[prop];

        if (prop === 'docTags') {
          mergeDocTags(valueA, valueB);
          if (part === 'props' && (propA as PropMeta).defaultValue.length === 0) {
            const defaultValue = valueB.find((tag) => tag.name === 'default' && tag.text);
            (propA as PropMeta).defaultValue = defaultValue ?? '';
          }
        } else if (prop === 'documentation' && isUndefined(valueA)) {
          propA[prop] = valueB;
        } else if (isBoolean(valueB) && valueB && !valueA) {
          propA[prop] = true;
        }
      });
    } else {
      partA.push(propB);
    }
  }
}
