import { ifDefined } from 'lit-html/directives/if-defined';

import { isNumber } from '../../utils/unit';

/**
 * A variant of `lit-html/directives/if-defined` which stops rendering if the given value is
 * not a number in addition to  `null`/`undefined`.
 *
 * @param {unknown} value
 * @returns {(part: import('lit-html').Part) => void}
 */
export const ifNumber = (value) =>
	ifDefined(!isNumber(value) ? undefined : value ?? undefined);
