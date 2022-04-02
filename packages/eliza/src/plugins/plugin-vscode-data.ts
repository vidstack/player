import { isUndefined } from '@vidstack/foundation';
import { ensureFile, writeFile } from 'fs-extra';

import { type ComponentMeta, type PropMeta } from '../meta';
import { resolveConfigPaths } from '../utils';
import { type PluginBuilder } from './Plugin';

export interface VscodeHtmlDataPluginConfig extends Record<string, unknown> {
  cwd: string;
  outFile: string;
  transformTagData?: (component: ComponentMeta, data: ITagData) => ITagData;
  transformAttributeData?: (prop: PropMeta, data: IAttributeData) => IAttributeData;
}

export const VSCODE_Html_DATA_PLUGIN_DEFAULT_CONFIG: VscodeHtmlDataPluginConfig = {
  cwd: process.cwd(),
  outFile: './vscode.html-data.json',
};

export async function normalizeVscodeHtmlDataPluginConfig(
  config: Partial<VscodeHtmlDataPluginConfig>,
): Promise<VscodeHtmlDataPluginConfig> {
  return resolveConfigPaths(config.cwd ?? VSCODE_Html_DATA_PLUGIN_DEFAULT_CONFIG.cwd, {
    ...VSCODE_Html_DATA_PLUGIN_DEFAULT_CONFIG,
    ...config,
  });
}

/**
 * Transforms component metadata into [VSCode Custom Data](https://github.com/microsoft/vscode-custom-data).
 * This will run in the `transform` plugin lifecycle step.
 */
export const vscodeHtmlDataPlugin: PluginBuilder<Partial<VscodeHtmlDataPluginConfig>> = (
  config = {},
) => ({
  name: '@vidstack/eliza/vscode-html-data',

  async transform(components) {
    const normalizedConfig = await normalizeVscodeHtmlDataPluginConfig(config);

    const output: HTMLDataV1 = {
      version: 1.1,
      tags: [],
    };

    components
      .filter((component) => !isUndefined(component.tagName))
      .forEach((component) => {
        const tagData: ITagData = {
          name: component.tagName!,
          description: component.documentation,
          attributes: component.props
            .filter((prop) => !!prop.attribute && !prop.readonly && !prop.internal)
            .map((prop) => {
              const data: IAttributeData = {
                name: prop.attribute!,
                description: prop.documentation,
                values: prop.unionTypesText
                  ?.filter(
                    (v) =>
                      v !== 'undefined' &&
                      v !== 'null' &&
                      v !== 'string' &&
                      v !== 'boolean' &&
                      v !== 'unknown' &&
                      v !== 'any' &&
                      v !== 'number',
                  )
                  .map((type) => ({ name: type })),
              };

              return config.transformAttributeData?.(prop, data) ?? data;
            }),
        };

        output.tags?.push(config.transformTagData?.(component, tagData) ?? tagData);
      });

    await ensureFile(normalizedConfig.outFile);
    await writeFile(normalizedConfig.outFile, JSON.stringify(output, undefined, 2));
  },
});

/**
 * https://github.com/microsoft/vscode-html-languageservice/blob/master/src/htmlLanguageTypes.ts#L164
 */

interface IReference {
  name: string;
  url: string;
}

interface ITagData {
  name: string;
  description?: string;
  attributes: IAttributeData[];
  references?: IReference[];
}

interface IAttributeData {
  name: string;
  description?: string;
  valueSet?: string;
  values?: IValueData[];
  references?: IReference[];
}

interface IValueData {
  name: string;
  description?: string;
  references?: IReference[];
}

interface IValueSet {
  name: string;
  values: IValueData[];
}

interface HTMLDataV1 {
  version: 1 | 1.1;
  tags?: ITagData[];
  globalAttributes?: IAttributeData[];
  valueSets?: IValueSet[];
}
