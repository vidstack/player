/**
 * Whether two numbers are roughly equal up to a certain precision.
 *
 * @param {number} numA
 * @param {number} numB
 * @param {number} precision
 * @returns {boolean}
 */
export function areNumbersRoughlyEqual(numA, numB, precision = 3) {
  return numA.toFixed(precision) === numB.toFixed(precision);
}

/**
 * Round a number to the given number of `decimalPlaces`.
 *
 * @param {number} num
 * @param {number} decimalPlaces
 * @returns {number}
 */
export function round(num, decimalPlaces = 2) {
  return Number(num.toFixed(decimalPlaces));
}

/**
 * Clamp a given `value` between a minimum and maximum value.
 *
 * @param {number} min
 * @param {number} value
 * @param {number} max
 * @returns {number}
 */
export function clampNumber(min, value, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get the number of decimal places in the given `num`.
 *
 * @param {number} num
 * @returns {number}
 * @example `1` -> `0`
 * @example `1.0` -> `0`
 * @example `1.1` -> `1`
 * @example `1.12` -> `2`
 */
export function getNumberOfDecimalPlaces(num) {
  return String(num).split('.')[1]?.length ?? 0;
}
