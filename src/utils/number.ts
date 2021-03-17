/**
 * Whether two numbers are roughly equal up to a certain precision.
 */
export function areNumbersRoughlyEqual(
  numA: number,
  numB: number,
  precision = 3,
): boolean {
  return numA.toFixed(precision) === numB.toFixed(precision);
}
