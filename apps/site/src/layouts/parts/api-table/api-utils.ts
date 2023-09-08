import { LRUCache } from 'lru-cache/min';

import { reactComponents, webComponents } from '../../../api/component-api';
import { pascalToKebabCase } from '../../../utils/string';

const cache = new LRUCache<string, any[]>({
  maxSize: 512,
  sizeCalculation() {
    return 1;
  },
});

export function findWebComponents(pathname: string) {
  if (cache.has(pathname)) {
    return cache.get(pathname)! as typeof webComponents;
  }

  let components = webComponents.filter((c) => {
    let slug = '/' + c.tag.name.replace('media-', '');

    // Special Cases.
    if (/^plyr-$/.test(slug)) {
      slug = '/plyr-layout';
    } else if (/-layout$/.test(slug)) {
      slug = '/default-layout';
    } else if (/\/controls/.test(slug)) {
      slug = '/controls';
    } else if (/\/tooltip/.test(slug)) {
      slug = '/tooltip';
    } else if (/\/menu/.test(slug)) {
      slug = '/menu';
    } else if (/\/radio/.test(slug)) {
      slug = '/radio-group';
    }

    return pathname.endsWith(slug);
  });

  cache.set(pathname, components);
  return components;
}

export function findReactComponents(pathname: string) {
  if (cache.has(pathname)) {
    return cache.get(pathname)! as typeof reactComponents;
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

export function getLinks(
  prop: PropMeta | MethodMeta | EventMeta | ReactPropMeta | ReactCallbackMeta,
) {
  return prop.doctags
    ? prop.doctags
        .filter((tag) => /(see|link)/.test(tag.name) && tag.text && tag.text.includes('http'))
        .map((tag) => tag.text!)
    : [];
}

const mdnRE = /(mozilla|mdn)/;
export function findMDNLink(links: string[]) {
  return links.find((tag) => mdnRE.test(tag));
}
