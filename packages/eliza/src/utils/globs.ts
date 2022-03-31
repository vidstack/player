import { existsSync, lstatSync } from 'fs';
import { globbySync } from 'globby';
import normalizePath from 'normalize-path';

const IGNORE_GLOBS = ['**/node_modules/**', '**/web_modules/**'];
const DEFAULT_DIR_GLOB = '**/*.{js,jsx,ts,tsx}';
const DEFAULT_GLOBS = [DEFAULT_DIR_GLOB];

export async function parseGlobs(globs: string[]): Promise<string[]> {
  if (globs.length === 0) {
    globs = DEFAULT_GLOBS;
  }

  const filePaths = await expandGlobs(globs);
  return filePaths.map((filePath) => normalizePath(filePath));
}

async function expandGlobs(globs: string | string[]): Promise<string[]> {
  globs = Array.isArray(globs) ? globs : [globs];

  const filePaths = await Promise.all(
    globs.map((g) => {
      try {
        /**
         * Test if the glob points to a directory. If so, return the result of a new glob that
         * searches for files in the directory excluding node_modules..
         */
        const dirExists = existsSync(g) && lstatSync(g).isDirectory();

        if (dirExists) {
          return globbySync([fastGlobNormalize(`${g}/${DEFAULT_DIR_GLOB}`)], {
            ignore: IGNORE_GLOBS,
            absolute: true,
            followSymbolicLinks: false,
          });
        }
      } catch (e) {
        // the glob wasn't a directory
      }

      return globbySync([fastGlobNormalize(g)], {
        ignore: IGNORE_GLOBS,
        absolute: true,
        followSymbolicLinks: false,
      });
    }),
  );

  return filePaths.flat();
}

/**
 * Fast glob recommends normalizing paths for windows, because fast glob expects a Unix-style path.
 * Read more here: https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
 */
function fastGlobNormalize(glob: string): string {
  return glob.replace(/\\/g, '/');
}
