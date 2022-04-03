import type { RequestHandler } from '@sveltejs/kit';
import {
  createMarkdownParser,
  type MarkdownHeader,
  type MarkdownMeta,
  parseMarkdownToSvelte,
} from '@vidstack/kit-plugins';
import { existsSync, readFileSync } from 'fs';
// @ts-expect-error - .
import type MarkdownIt from 'markdown-it';
import { resolve } from 'path';

const root = resolve(process.cwd(), './src/routes');

let parser: MarkdownIt;

export const get: RequestHandler = async ({ params }) => {
  const route = params.file.replace(/--/g, '/').replace(/\/$/, '').slice(1);
  const isComponentsRoute = /\/components\/?/.test(route) && !/\/api\/?/.test(route);

  let filePath = resolve(
    root,
    `./${isComponentsRoute ? route.replace(/\/react/, '') : route}${
      isComponentsRoute ? '/_Docs' : ''
    }.md`,
  );

  try {
    if (!existsSync(filePath)) {
      filePath = filePath.replace(/\.md$/, '/index.md');
    }

    const source = readFileSync(filePath).toString();

    if (!parser) {
      parser = await createMarkdownParser();
    }

    const { meta } = parseMarkdownToSvelte(parser, source, filePath);

    addCustomHeadings(filePath, meta);

    return {
      body: {
        meta,
      },
    };
  } catch (e) {
    // console.log(`Failed to find file:`, `\n\nRoute: ${route}`, `\nFile Path: ${filePath}`);
  }

  return {
    body: {},
  };
};

function addCustomHeadings(filePath: string, meta: MarkdownMeta) {
  if (filePath.includes('getting-started/quickstart') && !meta.headers.length) {
    const headers = [
      { title: 'Player Installation', slug: 'player-installation', level: 2, children: [] },
      { title: 'Native Media Controls', slug: 'native-media-controls', level: 2, children: [] },
      { title: 'Media Autoplay', slug: 'media-autoplay', level: 2, children: [] },
      { title: 'Player Poster', slug: 'player-poster', level: 2, children: [] },
      { title: 'Player Sizing', slug: 'player-sizing', level: 2, children: [] },
      { title: 'Player Skins', slug: 'player-skins', level: 2, children: [] },
      !/(quickstart\/(cdn|react))/.test(filePath) && {
        title: 'Importing Everything',
        slug: 'importing-everything',
        level: 2,
        children: [],
      },
    ].filter(Boolean) as MarkdownHeader[];

    meta.headers.push(...headers);
  }
}
