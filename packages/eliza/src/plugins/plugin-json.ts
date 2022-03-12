import { ensureFile, writeFile } from 'fs-extra';

import { type ComponentMeta } from '../meta';
import { resolveConfigPaths } from '../utils';
import { type PluginBuilder } from './Plugin';

export const JSON_PLUGIN_IGNORED_KEYS = new Set([
  'symbol',
  'declaration',
  'decorator',
  'enumDeclaration',
  'type',
  'node',
  'file',
  'signature',
  'returnType',
  'heritage',
]);

export type JsonOutput = Record<string, any> & {
  components: (Omit<ComponentMeta, 'dependencies' | 'dependents'> & {
    dependents: string[];
    dependencies: string[];
  })[];
};

export interface JsonPluginConfig extends Record<string, unknown> {
  cwd: string;
  outFile: string;
  transformJson?: (output: JsonOutput) => Record<string, any>;
  stringifyJson?: (
    output: JsonOutput,
    defaultReplacer: (key: string, value: any) => any,
    space: number,
  ) => string;
}

export const JSON_PLUGIN_DEFAULT_CONFIG: JsonPluginConfig = {
  cwd: process.cwd(),
  outFile: './elements.json',
};

export async function normalizeJsonPluginConfig(
  config: Partial<JsonPluginConfig>,
): Promise<JsonPluginConfig> {
  return resolveConfigPaths(config.cwd ?? JSON_PLUGIN_DEFAULT_CONFIG.cwd, {
    ...JSON_PLUGIN_DEFAULT_CONFIG,
    ...config,
  });
}

const defaultReplacer = (key: string, value: any) => {
  if (JSON_PLUGIN_IGNORED_KEYS.has(key)) return undefined;
  return value;
};

/**
 * Transforms component metadata into JSON format. This will run in the `transform` plugin
 * lifecycle step.
 */
export const jsonPlugin: PluginBuilder<Partial<JsonPluginConfig>> = (config = {}) => ({
  name: '@vidstack/eliza/json',

  async transform(components, fs) {
    const normalizedConfig = await normalizeJsonPluginConfig(config);

    const output: JsonOutput = {
      components: [],
    };

    components
      .map((component) => ({
        ...component,
        dependencies: component.dependencies.map((c) => c.tagName!),
        dependents: component.dependents.map((c) => c.tagName!),
      }))
      .forEach((component) => {
        output.components.push(component as any);
      });

    const stringify = config.stringifyJson ?? JSON.stringify;
    const finalOutput = normalizedConfig.transformJson?.(output) ?? output;

    await ensureFile(normalizedConfig.outFile);
    await writeFile(
      normalizedConfig.outFile,
      stringify(finalOutput as JsonOutput, defaultReplacer, 2),
    );
  },
});
