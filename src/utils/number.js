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
