import type { RequestHandler } from '@sveltejs/kit';
import { createMarkdownParser, parseMarkdownToSvelte } from '@vidstack/kit-plugins';
import { existsSync, readFileSync } from 'fs';
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
