import { kebabToTitleCase } from '@vidstack/foundation';
import { noendslash, sortOrderedPageFiles } from '@vitebook/core';
import fs from 'fs';
import path from 'path';

import type { SidebarLink, SidebarLinks } from '$src/layouts/sidebar/context';
import { formatElementHeading } from '$src/stores/element';

export function readDirDeepSync(dir: string, exclude?: RegExp) {
  const files: string[] = [];

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...readDirDeepSync(filePath, exclude));
    } else if (!exclude || !exclude.test(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

export function loadSidebar(): SidebarLinks {
  const exclude = /\/_|@layout|@markdoc|\/api\.md$|quickstart\/[^index]|styling\/[^index]/;
  const stripRootPathRE = /^(.*?)\[lib\]\//;

  const files = readDirDeepSync('pages/docs/player/[lib]', exclude).map((file) =>
    file.replace(stripRootPathRE, ''),
  );

  const slugs = sortOrderedPageFiles(files).map((file) =>
    file.replace(/\/index\.md$/, '/').replace(/\.md$/, '.html'),
  );

  return {
    'Getting Started': links(slugs, /^\/getting-started/),
    Providers: links(slugs, /^\/components\/providers/),
    Media: links(slugs, /^\/components\/media/),
    UI: links(slugs, /^\/components\/ui/),
  };
}

function links(slugs: string[], include: RegExp): SidebarLink[] {
  return slugs
    .filter((slug) => include.test(slug))
    .map((slug) => {
      const title = kebabToTitleCase(
        noendslash(slug.replace(/\.html$/, ''))
          .split('/')
          .pop()!,
      );
      return {
        title: formatElementHeading(title),
        slug: `/docs/player${slug}`,
      };
    });
}
