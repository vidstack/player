import fs from 'node:fs';
import path from 'node:path';

import { slash } from '@vessel-js/app/http';

import type { SidebarLink, SidebarLinks } from '$lib/layouts/sidebar/context';
import { formatElementHeading } from '$lib/stores/element';
import { kebabToTitleCase } from '$lib/utils/string';

export function loadPlayerSidebar(): SidebarLinks {
  const include = /\/(_|page)\.md/;
  const exclude = /\[lib=|\/cdn/;
  const stripRootPathRE = /^(.*?)\[lib\]\/player/;

  const files = readDirDeepSync('app/docs/[lib]/player', include, exclude).map((file) =>
    file.replace(stripRootPathRE, ''),
  );

  const slugs = sortOrderedPageFiles(files).map((path) =>
    stripRouteOrder(path).replace(include, ''),
  );

  return {
    'Getting Started': links(slugs, /^\/getting-started/),
    Providers: links(slugs, /^\/components\/providers/),
    Media: links(slugs, /^\/components\/media/),
    UI: links(slugs, /^\/components\/ui/),
  };
}

function links(slugs: string[], filter: RegExp): SidebarLink[] {
  return slugs
    .filter((slug) => filter.test(slug))
    .map((slug) => {
      return {
        title: formatElementHeading(kebabToTitleCase(slug.split('/').pop()!)),
        slug: `/docs/player${slug}`,
      };
    });
}

const STRIP_ROUTE_ORDER_RE = /\/\[(\d+)\]/g;
function stripRouteOrder(filePath: string) {
  return filePath.replace(STRIP_ROUTE_ORDER_RE, '/');
}

function sortOrderedPageFiles(files: string[]): string[] {
  return files
    .map(slash)
    .sort((fileA, fileB) => calcPageOrderScore(fileA) - calcPageOrderScore(fileB))
    .map(stripRouteOrder);
}

function calcPageOrderScore(filePath: string): number {
  let score = 1;

  for (const matches of filePath.matchAll(STRIP_ROUTE_ORDER_RE) ?? []) {
    score *= Number(matches[1]);
  }

  return score;
}

function readDirDeepSync(dir: string, include: RegExp, exclude: RegExp) {
  const files: string[] = [];

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...readDirDeepSync(filePath, include, exclude));
    } else if (include.test(filePath) && !exclude.test(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}
