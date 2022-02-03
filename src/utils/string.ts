/**
 * Converts a camelCase string to kebab-case.
 *
 * @example 'myProperty' -> 'my-property'
 */
export function camelToKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
