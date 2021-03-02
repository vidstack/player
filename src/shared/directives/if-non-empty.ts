import { Part } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * A variant of `if-non-null` which stops rendering if the given value is an emptry string in
 * addition to `null`/`undefined`.
 */
export const ifNonEmpty = (value: unknown): ((part: Part) => void) =>
  ifDefined(value === '' ? undefined : value ?? undefined);
