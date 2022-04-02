import type { EnumDeclaration, Node, Signature, SourceFile, Type } from 'typescript';

export type TypeText = 'any' | 'string' | 'number' | 'boolean' | 'unknown' | 'never';

export interface PropTypeInfo {
  original: string;
  resolved: string;
}

export interface PropMeta {
  node: Node;
  typeText: TypeText;
  unionTypesText?: string[];
  typeInfo: PropTypeInfo;
  docTags: DocTagMeta[];
  name: string;
  static: boolean;
  required: boolean;
  readonly: boolean;
  optional: boolean;
  attribute?: string;
  reflect: boolean;
  internal: boolean;
  deprecated: boolean;
  defaultValue: string;
  documentation?: string;
  enum: boolean;
  enumDefaultValue?: string;
  enumDeclaration?: EnumDeclaration;
}

export interface MethodTypeInfo {
  signatureText: string;
  returnText: string;
}

export interface ParameterMeta {
  node: Node;
  name: string;
  typeText: TypeText;
  typeInfo: PropTypeInfo;
  optional: boolean;
  defaultValue?: string;
}

export interface MethodMeta {
  node: Node;
  name: string;
  parameters: ParameterMeta[];
  typeInfo: MethodTypeInfo;
  signature: Signature;
  returnType: Type;
  static: boolean;
  internal: boolean;
  deprecated: boolean;
  docTags: DocTagMeta[];
  documentation?: string;
}

export type EventTypeInfo = PropTypeInfo;

export interface EventMeta {
  node: Node;
  typeInfo: EventTypeInfo;
  name: string;
  bubbles: boolean;
  composed: boolean;
  internal: boolean;
  deprecated: boolean;
  docTags: DocTagMeta[];
  documentation?: string;
}

export interface CssPropMeta {
  name: string;
  description?: string;
  node: Node;
}

export interface CssPartMeta {
  name: string;
  description?: string;
  node: Node;
}

export interface SlotMeta {
  name: string;
  default: boolean;
  description?: string;
  node: Node;
}

export interface DocTagMeta {
  name: string;
  text?: string;
  node: Node;
}

export interface SourceMeta {
  node: Node;
  file: SourceFile;
  dirPath: string;
  dirName: string;
  fileName: string;
  fileBase: string;
  filePath: string;
  fileExt: string;
}

export type HeritageTypeInfo = PropTypeInfo;

export enum HeritageKind {
  Subclass = 'subclass',
  Interface = 'interface',
  Mixin = 'mixin',
}

export interface HeritageMeta {
  node: Node;
  name: string;
  kind: HeritageKind;
  typeInfo: HeritageTypeInfo;
  parent?: HeritageMeta;
  documentation?: string;
  mixin?: MixinMeta;
  component?: ComponentMeta;
  interface?: InterfaceMeta;
}

export type MixinMeta = ComponentMeta;

export interface InterfaceMeta {
  node: Node;
  props: PropMeta[];
  source: SourceMeta;
  methods: MethodMeta[];
  heritage: HeritageMeta[];
  documentation?: string;
  docTags: DocTagMeta[];
}

export interface ComponentMeta extends Record<string, unknown> {
  node: Node;
  tagName?: string;
  className: string;
  documentation?: string;
  source: SourceMeta;
  docTags: DocTagMeta[];
  props: PropMeta[];
  methods: MethodMeta[];
  events: EventMeta[];
  heritage: HeritageMeta[];
  cssProps: CssPropMeta[];
  cssParts: CssPartMeta[];
  slots: SlotMeta[];
  dependents: ComponentMeta[];
  dependencies: ComponentMeta[];
}
