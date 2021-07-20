/**
 * Create a `TimeRanges` object
 *
 * @param {number | [number, number][]} [start] - The start of a single range (a number) or an
 * array of ranges (an array of arrays of two numbers each).
 * @param {number} [end] - The end of a single range. Cannot be used with the array form of the
 * `start` argument.
 * @returns {TimeRanges}
 * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
 */
export function createTimeRanges(start?: number | [number, number][] | undefined, end?: number | undefined): TimeRanges;
