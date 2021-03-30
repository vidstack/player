import { litPlugin, markdownPlugin, Plugin, vscodePlugin } from '@wcom/cli';
import prettier from 'prettier';

export default [
  litPlugin(),
  eventDiscoveryPlugin(),
  dependencyDiscoveryPlugin(),
  storybookPlugin(),
  markdownPlugin({
    async transformContent(_, content) {
      return prettier.format(content, {
        arrowParens: 'avoid',
        parser: 'markdown',
        singleQuote: true,
        trailingComma: 'all',
      });
    },
  }),
  vscodePlugin(),
];

// TODO: Plugin to discover component events.
function eventDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-events',

    async postbuild(components) {
      // look for sourceFile ending in `.events`
      // if found then look for componentmeta with matching sourceDir
      // read `.events` and if classdec + extension of VdsEvents or something then use
      // unpack into event meta
      // attach to componentmeta
      return components;
    },
  };
}

// TODO: Plugin to discover component dependencies/dependents.
function dependencyDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-deps',

    async postbuild(components) {
      // look for deps in the side effect file `vds-*.ts`.
      return components;
    },
  };
}

// TODO: Plugin to generate component Storybook controls/stories.
function storybookPlugin(): Plugin {
  return {
    name: 'vds-storybook',
  };
}
