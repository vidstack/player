import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * For AttributeParts, sets the attribute if the value is defined and non-empty, and removes
 * the attribute if the value is undefined or empty (`''`).
 *
 * For other part types, this directive is a no-op.
 */
export function ifNonEmpty(value: string | undefined) {
  return ifDefined(value === '' || value === 'undefined' ? undefined : value);
}
