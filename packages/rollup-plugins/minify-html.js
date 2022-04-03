import { createFilter } from '@rollup/pluginutils';
import * as minify from 'minify-html-literals';

/**
 * @typedef {{
 *   include?: import('@rollup/pluginutils').FilterPattern;
 *   exclude?: import('@rollup/pluginutils').FilterPattern;
 * }} MinifyHTMLOptions
 */

/**
 * @param {MinifyHTMLOptions} options
 * @returns {import ('rollup').Plugin}
 */
export function minifyHTML(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'minify-html-literals',
    transform(code, id) {
      if (!filter(id)) return null;

      return /** @type {*} */ (
        minify.minifyHTMLLiterals(code, {
          fileName: id,
        })
      );
    },
  };
}
