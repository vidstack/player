import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * For AttributeParts, sets the attribute if the value is defined and non-empty, and removes
 * the attribute if the value is undefined or empty (`''`).
 *
 * For other part types, this directive is a no-op.
 *
 * @template {string | undefined} T
 * @param {T} value
 */
export const ifNonEmpty = (value) =>
	ifDefined(value === '' || value === 'undefined' ? undefined : value);
