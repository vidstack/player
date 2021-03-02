import { Part } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * A variant of `lit-html/directives/if-defined` which stops rendering if the given value is
 * `null` in addition to `undefined`.
 */
export default (value: unknown): ((part: Part) => void) =>
  ifDefined(value ?? undefined);
