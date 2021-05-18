import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * A variant of `if-non-null` which stops rendering if the given value is an emptry string in
 * addition to `null`/`undefined`.
 *
 * @param {unknown} value
 * @returns {(part: import('lit-html').Part) => void}
 */
export const ifNonEmpty = (value) =>
	ifDefined(
		value === '' || value === 'undefined' ? undefined : value ?? undefined
	);
