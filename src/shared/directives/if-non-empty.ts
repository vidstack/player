import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * For AttributeParts, sets the attribute if the value is defined and non-empty, and removes
 * the attribute if the value is undefined or empty (`''`).
 *
 * For other part types, this directive is a no-op.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ifNonEmpty = <T extends string | undefined>(value: T) =>
  ifDefined(value === '' || value === 'undefined' ? undefined : value);
