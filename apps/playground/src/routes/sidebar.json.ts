import { kebabToTitleCase } from '@vidstack/foundation';
import globby from 'fast-glob';
import path from 'path';

export async function get() {
  // eslint-disable-next-line import/no-named-as-default-member
  const filePaths = globby.sync('./**/!(_).svelte', {
    cwd: path.resolve('./src/routes'),
  });

  return {
    body: {
      sidebar: buildNav(filePaths),
    },
  };
}

function buildNav(filePaths: string[]) {
  const nav = {};

  for (const filePath of filePaths) {
    const segments = filePath.replace(/(\/index|\.svelte)/g, '').split('/');
    const category = segments[0];
    const component = segments[1];
    const variant = segments[2];

    if (!variant) continue;

    const categoryTitle = kebabToTitleCase(category);
    const componentTitle = kebabToTitleCase(component);

    if (!nav[categoryTitle]) {
      nav[categoryTitle] = {};
    }

    if (!nav[categoryTitle][componentTitle]) {
      nav[categoryTitle][componentTitle] = [];
    }

    const title = kebabToTitleCase(variant);
    const slug = `/${filePath.replace(/\.svelte$/, '')}`;

    nav[categoryTitle][componentTitle].push({ title, slug });
  }

  return nav;
}
