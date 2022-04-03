export const escapeQuotes = (str: string): string =>
  str.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');

export const normalizeLineBreaks = (str: string): string => str.replace(/\\r/g, '\n');

export function splitLineBreaks(str: string): string[] {
  if (typeof str !== 'string') return [];
  return normalizeLineBreaks(str).split('\n');
}

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts a kebab-case string to Title Case.
 *
 * @example `myProperty -> My Property`
 */
export function kebabToTitleCase(str: string) {
  return uppercaseFirstLetter(str.replace(/-./g, (x) => ' ' + x[1].toUpperCase()));
}

/**
 * Converts a camelCase string to kebab-case.
 *
 * @example `myProperty -> my-property`
 */
export function camelToKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts a kebab-case string to camelCase.
 *
 * @example `my-property -> myProperty`
 */
export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}

/**
 * Converts a kebab-case string to PascalCase.
 *
 * @example `myProperty -> MyProperty`
 */
export function kebabToPascalCase(str: string) {
  return kebabToTitleCase(str).replace(/\s/g, '');
}

/**
 * Converts a camelCase string to Title Case.
 *
 * @example `myProperty -> Title Case`
 */
export function camelToTitleCase(str: string) {
  return uppercaseFirstLetter(str.replace(/([A-Z])/g, ' $1'));
}
