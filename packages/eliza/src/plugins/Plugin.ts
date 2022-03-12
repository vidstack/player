import type { ClassDeclaration, ClassExpression, Program, SourceFile } from 'typescript';

import { type ComponentMeta, type HeritageMeta } from '../meta';

export interface Plugin {
  name: string;
  init?(program: Program): Promise<void>;
  discover?(sourceFile: SourceFile): Promise<ClassDeclaration | ClassExpression | null | undefined>;
  build?(
    declaration: ClassDeclaration | ClassExpression,
  ): Promise<ComponentMeta | null | undefined | void>;
  postbuild?(
    component: ComponentMeta,
    sourceFile: SourceFile,
  ): Promise<ComponentMeta | null | undefined | void>;
  link?(
    component: ComponentMeta,
    heritage: HeritageMeta,
    sourceFile: SourceFile,
    sourceFiles: SourceFile[],
  ): Promise<ComponentMeta | null | undefined | void>;
  postlink?(
    component: ComponentMeta,
    sourceFile: SourceFile,
    sourceFiles: SourceFile[],
  ): Promise<ComponentMeta | null | undefined | void>;
  transform?(
    components: ComponentMeta[],
    sourceFiles: Map<ComponentMeta, SourceFile>,
  ): Promise<void>;
  destroy?(): Promise<void>;
}

export type PluginBuilder<ConfigType = any> = (config?: ConfigType) => Plugin;
