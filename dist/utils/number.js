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
