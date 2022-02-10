/**
 * Converts a camelCase string to kebab-case.
 *
 * @example 'myProperty' -> 'my-property'
 */
export function camelToKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts a kebab-case string to camelCase.
 *
 * @example 'my-property' -> 'myProperty'
 */
export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
