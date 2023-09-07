import { LRUCache } from 'lru-cache/min';

import { reactComponents } from '../../../api/component-api';
import { pascalToKebabCase } from '../../../utils/string';

const cache = new LRUCache<string, any[]>({
  maxSize: 512,
  sizeCalculation(value) {
    return 1;
  },
});

export function findReactComponents(pathname: string) {
  if (cache.has(pathname)) {
    return cache.get(pathname)!;
  }

  let components = reactComponents.filter((c) => {
    let slug = '/' + pascalToKebabCase(c.namespace ?? c.name).replace('media-', '');

    // Special Cases.
    if (slug === '/pipbutton') {
      slug = '/pip-button';
    } else if (/default-.*?-layout$/.test(slug)) {
      slug = '/default-layout';
    } else if (/plyr-.*?-layout$/.test(slug)) {
      slug = '/plyr-layout';
    }

    return pathname.endsWith(slug);
  });

  for (const component of components) {
    if (!component.namespace || !component.exports) continue;

    for (const { file, alias } of component.exports) {
      const exports = reactComponents.filter((c) => c.file.path === `${file}.tsx`);

      for (const exported of exports) {
        const aliasName = alias?.[exported.name] ?? exported.name;

        if (components.some((c) => c.name === aliasName) || (alias && !alias[exported.name])) {
          continue;
        }

        components.push({
          ...exported,
          namespace: component.namespace,
          name: aliasName,
          propsType: exported.propsType
            ? alias?.[exported.propsType] ?? exported.propsType
            : undefined,
        });
      }
    }
  }

  cache.set(pathname, components);
  return components;
}
