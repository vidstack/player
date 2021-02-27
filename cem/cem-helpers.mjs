/* eslint-disable */
import ts from 'typescript';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { existsSync, lstatSync } from 'fs';

export function readTsConfigFile() {
  const configPath = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    'tsconfig.json',
  );

  return ts.readConfigFile(configPath, ts.sys.readFile).config;
}

export function compileOnce(filePaths) {
  return ts.createProgram(filePaths, readTsConfigFile());
}

export const normalizeLineBreaks = text => text.replace(/\\r/g, '\n');

export function getDocumentation(checker, id) {
  const comment = checker
    .getSymbolAtLocation(id)
    ?.getDocumentationComment(checker);
  return normalizeLineBreaks(ts.displayPartsToString(comment) ?? '');
}

const IGNORE_GLOBS = ['**/node_modules/**', '**/web_modules/**'];
const DEFAULT_DIR_GLOB = '**/*.{js,jsx,ts,tsx}';
const DEFAULT_GLOBS = [DEFAULT_DIR_GLOB];

export async function parseGlobs(globs) {
  if (globs.length === 0) globs = DEFAULT_GLOBS;
  const filePaths = await expandGlobs(globs);
  return filePaths.map(filePath => normalizePath(filePath));
}

export async function expandGlobs(globs) {
  globs = Array.isArray(globs) ? globs : [globs];

  return arrayFlat(
    await Promise.all(
      globs.map(g => {
        try {
          /**
           * Test if the glob points to a directory. If so, return the result of a new glob that
           * searches for files in the directory excluding node_modules..
           */
          const dirExists = existsSync(g) && lstatSync(g).isDirectory();

          if (dirExists) {
            return fastGlob([fastGlobNormalize(`${g}/${DEFAULT_DIR_GLOB}`)], {
              ignore: IGNORE_GLOBS,
              absolute: true,
              followSymbolicLinks: false,
            });
          }
        } catch (e) {
          // the glob wasn't a directory
        }

        return fastGlob([fastGlobNormalize(g)], {
          ignore: IGNORE_GLOBS,
          absolute: true,
          followSymbolicLinks: false,
        });
      }),
    ),
  );
}

/**
 * Fast glob recommends normalizing paths for windows, because fast glob expects a Unix-style path.
 * Read more here: https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
 */
export function fastGlobNormalize(glob) {
  return glob.replace(/\\/g, '/');
}

export function arrayFlat(items) {
  if ('flat' in items) {
    return items.flat();
  }

  const flattenArray = [];
  for (const item of items) {
    flattenArray.push(...item);
  }

  return flattenArray;
}
