import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * A variant of `lit-html/directives/if-defined` which stops rendering if the given value is
 * `null` in addition to `undefined`.
 *
 * @param {unknown} value
 * @returns {(part: import('lit-html').Part) => void}
 */
export const ifNonNull = (value) => ifDefined(value ?? undefined);
