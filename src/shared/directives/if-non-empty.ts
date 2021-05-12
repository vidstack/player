import { nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined';

/**
 * For AttributeParts, sets the attribute if the value is defined and non-empty, and removes
 * the attribute if the value is undefined or empty (`''`).
 *
 * For other part types, this directive is a no-op.
 */
export const ifNonEmpty = <T extends string | undefined>(
  value: T,
): typeof nothing | NonNullable<T> =>
  ifDefined(
    value === '' || value === 'undefined' ? undefined : value ?? undefined,
  );
