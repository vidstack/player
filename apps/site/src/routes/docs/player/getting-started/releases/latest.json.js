import { globbySync } from 'globby';
import { resolve } from 'path';

import { sortMonthYearFiles } from '$lib/utils/date';

const cwd = resolve(process.cwd(), 'src/routes/docs/player/getting-started/releases');

const files = globbySync('*.md', { cwd });
const slug = sortMonthYearFiles(files)[0].replace(/\.md($|\/)/, '');

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  return {
    body: {
      slug,
    },
  };
}
