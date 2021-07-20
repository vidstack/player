import { ifDefined } from 'lit/directives/if-defined.js';
// eslint-disable-next-line jsdoc/require-returns
/**
 * For AttributeParts, sets the attribute if the value is defined and non-empty, and removes
 * the attribute if the value is undefined or empty (`''`).
 *
 * For other part types, this directive is a no-op.
 *
 * @template {string | undefined} T
 * @param {T} value
 */
export function ifNonEmpty(value) {
  return ifDefined(value === '' || value === 'undefined' ? undefined : value);
}
