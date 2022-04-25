import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';

const componentsDirRE = /\/components\//;

export const get = createSidebarRequestHandler({
  exclude: ['/docs/player/index.svelte'],
  extensions: ['.md', '.svelte'],
  formatCategoryName: (dirname, { format }) => format(dirname).replace('Ui', 'UI'),
  resolveTitle: ({ resolve, cleanFilePath }) => {
    if (componentsDirRE.test(cleanFilePath)) {
      return resolve().replace(' Docs', '');
    }
  },
});
