import { cleanFilePath } from '@svelteness/kit-docs/node';
import { basename, dirname } from 'path';

/**
 * @param {string} filePath
 */
export function getComponentNameFromId(filePath) {
  const baseTagName = basename(dirname(cleanFilePath(filePath.replace(/\/react/, ''))));
  const tagName = `vds-${baseTagName}`;
  return {
    baseTagName,
    tagName,
  };
}
