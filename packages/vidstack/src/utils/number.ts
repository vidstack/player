/**
 * Round a number to the given number of `decimalPlaces`.
 */
export function round(num: number, decimalPlaces = 2): number {
  return Number(num.toFixed(decimalPlaces));
}

/**
 * Get the number of decimal places in the given `num`.
 *
 * @example `1 -> 0`
 * @example `1.0 -> 0`
 * @example `1.1 -> 1`
 * @example `1.12 -> 2`
 */
export function getNumberOfDecimalPlaces(num: number): number {
  return String(num).split('.')[1]?.length ?? 0;
}

/**
 * Clamp a given `value` between a minimum and maximum value.
 */
export function clampNumber(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
