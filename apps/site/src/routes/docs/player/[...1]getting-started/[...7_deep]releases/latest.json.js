import { globbySync } from 'globby';
import { dirname, resolve } from 'path';

import { sortMonthYearFiles } from '$lib/utils/date';

const __cwd = process.cwd();

const releasesDir = resolve(
  __cwd,
  'src/routes/docs/player/[...1]getting-started/[...7_deep]releases',
);

const files = globbySync('*.md', { cwd: releasesDir });
const slug = sortMonthYearFiles(files)[0].replace(/\.md($|\/)/, '');

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  return {
    body: {
      slug,
    },
  };
}
