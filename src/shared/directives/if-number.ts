import { Part } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

import { isNumber } from '../../utils/unit';

/**
 * A variant of `lit-html/directives/if-defined` which stops rendering if the given value is
 * not a number in addition to  `null`/`undefined`.
 */
export const ifNumber = (value: unknown): ((part: Part) => void) =>
  ifDefined(!isNumber(value) ? undefined : value ?? undefined);
