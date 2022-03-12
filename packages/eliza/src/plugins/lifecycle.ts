import { isUndefined } from '@vidstack/foundation';
import { createHash } from 'crypto';
import kleur from 'kleur';
import LRUCache from 'lru-cache';
import type {
  ClassDeclaration,
  ClassExpression,
  Program,
  SourceFile,
  TypeChecker,
} from 'typescript';

import { formatPluginName, log, LogLevel, logWithTime } from '../logger';
import {
  buildComponentMetaWithHeritage,
  type ComponentMeta,
  type HeritageMeta,
  mergeAllComponentParts,
  traverseHeritageTree,
} from '../meta';
import { resolvePath } from '../utils/resolve';
import { type Plugin } from './Plugin';

export async function runPluginsInit(program: Program, plugins: Plugin[]): Promise<void> {
  for (const plugin of plugins) {
    if (isUndefined(plugin.init)) continue;
    const startTime = process.hrtime();
    await plugin.init(program);
    logWithTime(`${formatPluginName(plugin.name)} \`init\``, startTime, LogLevel.Verbose);
  }
}

let prevHash: string;
const cache = new LRUCache<string, ComponentMeta>({ max: 1024 });
export async function runPlugins(
  program: Program,
  plugins: Plugin[],
  paths: string[],
  watching = false,
) {
  const validFilePaths = new Set(paths);

  const sourceFiles = program
    .getSourceFiles()
    .filter((sf) => validFilePaths.has(resolvePath(sf.fileName)))
    .sort((sfA, sfB) => (sfA.fileName > sfB.fileName ? 1 : -1));

  if (watching) {
    const hashSum = createHash('sha256');
    for (const file of sourceFiles) hashSum.update(file.text);
    const newHash = hashSum.digest('hex');

    if (prevHash !== newHash) {
      prevHash = newHash;
    } else {
      return;
    }
  }

  const checker = program.getTypeChecker();

  await runPluginsInit(program, plugins);

  const components: ComponentMeta[] = [];
  const sources = new Map<ComponentMeta, SourceFile>();

  for (const sourceFile of sourceFiles) {
    const cacheKey = createHash('sha256').update(sourceFile.text).digest('hex');

    if (cache.has(cacheKey)) {
      log(`plugins cache hit: ${sourceFile.fileName}`, LogLevel.Verbose);
      const component = cache.get(cacheKey)!;
      sources.set(component, sourceFile);
      components.push(component);
      continue;
    }

    const declaration = await runPluginsDiscover(plugins, sourceFile);
    if (!declaration) continue;

    const component = await runPluginsBuild(plugins, checker, declaration);
    if (!component) continue;

    const postBuiltComponent = await runPluginsPostBuild(plugins, component, sourceFile);
    const linkedComponent = await runPluginsLink(
      plugins,
      postBuiltComponent,
      sourceFile,
      sourceFiles,
    );
    const postLinkedComponent = await runPluginsPostLink(
      plugins,
      linkedComponent,
      sourceFile,
      sourceFiles,
    );
    cache.set(cacheKey, postLinkedComponent);
    sources.set(postLinkedComponent, sourceFile);
    components.push(postLinkedComponent);
  }

  await runPluginsTransform(plugins, components, sources);
  await runPluginsDestroy(plugins);

  return { sourceFiles };
}

export async function runPluginsDiscover(plugins: Plugin[], sourceFile: SourceFile) {
  for (const plugin of plugins) {
    if (isUndefined(plugin.discover)) continue;

    const startTime = process.hrtime();
    const discoveredNode = await plugin.discover(sourceFile);

    logWithTime(`${formatPluginName(plugin.name)} \`discover\``, startTime, LogLevel.Verbose);

    if (discoveredNode) {
      log(
        `${formatPluginName(plugin.name)} discovered component in ${kleur.blue(
          sourceFile.fileName,
        )}`,
        LogLevel.Verbose,
      );

      return discoveredNode;
    }
  }

  return null;
}

export async function runPluginsBuild(
  plugins: Plugin[],
  checker: TypeChecker,
  declaration: ClassDeclaration | ClassExpression,
) {
  for (const plugin of plugins) {
    if (isUndefined(plugin.build)) continue;

    const startTime = process.hrtime();
    const component = await buildComponentMetaWithHeritage(checker, plugin, declaration);

    logWithTime(`${formatPluginName(plugin.name)} \`build\``, startTime, LogLevel.Verbose);

    if (component) {
      log(
        `${formatPluginName(plugin.name)} built meta for ${kleur.blue(component.tagName ?? '')}`,
        LogLevel.Verbose,
      );

      return component;
    }
  }

  return null;
}

export async function runPluginsPostBuild(
  plugins: Plugin[],
  component: ComponentMeta,
  sourceFile: SourceFile,
) {
  for (const plugin of plugins) {
    if (isUndefined(plugin.postbuild)) continue;
    const startTime = process.hrtime();
    component = (await plugin.postbuild?.(component, sourceFile)) ?? component;
    logWithTime(`${formatPluginName(plugin.name)} \`postbuild\``, startTime, LogLevel.Verbose);
  }

  return component;
}

export async function runPluginsLink(
  plugins: Plugin[],
  component: ComponentMeta,
  sourceFile: SourceFile,
  sourceFiles: SourceFile[],
) {
  const heritages: HeritageMeta[] = [];

  traverseHeritageTree(component.heritage, (heritage) => {
    heritages.push(heritage);
  });

  // Base link.
  const baseLinkStartTime = process.hrtime();
  for (const heritage of heritages) {
    component = baseLink(component, heritage);
  }
  logWithTime(`\`link\``, baseLinkStartTime, LogLevel.Verbose);

  // Link.
  for (const plugin of plugins) {
    if (isUndefined(plugin.link)) continue;

    const startTime = process.hrtime();

    for (const heritage of heritages) {
      component = (await plugin.link(component, heritage, sourceFile, sourceFiles)) ?? component;
    }

    logWithTime(`${formatPluginName(plugin.name)} \`link\``, startTime, LogLevel.Verbose);
  }

  return component;
}

export function baseLink(component: ComponentMeta, heritage: HeritageMeta): ComponentMeta {
  const merge = heritage.component ?? heritage.mixin ?? heritage.interface;

  if (!isUndefined(merge)) {
    const { props, methods, docTags } = merge;
    const { events, cssProps, cssParts, dependencies } = merge as ComponentMeta;

    const meta = {
      props,
      docTags,
      methods,
      events,
      cssProps,
      cssParts,
      dependencies,
    };

    mergeAllComponentParts(component, meta);
  }

  return component;
}

export async function runPluginsPostLink(
  plugins: Plugin[],
  component: ComponentMeta,
  sourceFile: SourceFile,
  sourceFiles: SourceFile[],
) {
  for (const plugin of plugins) {
    if (isUndefined(plugin.postlink)) continue;
    const startTime = process.hrtime();
    component = (await plugin.postlink(component, sourceFile, sourceFiles)) ?? component;
    logWithTime(`${formatPluginName(plugin.name)} \`postlink\``, startTime, LogLevel.Verbose);
  }

  return component;
}

export async function runPluginsTransform(
  plugins: Plugin[],
  components: ComponentMeta[],
  sourceFiles: Map<ComponentMeta, SourceFile>,
): Promise<void> {
  for (const plugin of plugins) {
    if (isUndefined(plugin.transform)) continue;
    const startTime = process.hrtime();
    await plugin.transform(components, sourceFiles);
    logWithTime(`${formatPluginName(plugin.name)} \`transform\``, startTime, LogLevel.Verbose);
  }
}

export async function runPluginsDestroy(plugins: Plugin[]): Promise<void> {
  for (const plugin of plugins) {
    if (isUndefined(plugin.destroy)) continue;
    const startTime = process.hrtime();
    await plugin.destroy();
    logWithTime(`${formatPluginName(plugin.name)} \`destroy\``, startTime, LogLevel.Verbose);
  }
}
