/**
 * @see https://github.com/videojs/video.js/blob/main/src/js/utils/time-ranges.js
 */
import { isArray, isNumber, isUndefined } from 'maverick.js/std';

/**
 * Get the time for the specified index at the start or end of a `TimeRanges` object.
 *
 * @param fnName - The function name to use for logging.
 * @param valueIndex - The property that should be used to get the time. should be 0 for 'start' or  1 for 'end'.';
 * @param ranges - An array of time ranges.
 * @param rangeIndex - The index to start the search at.
 */
function getRange(
  fnName: 'start' | 'end',
  valueIndex: 0 | 1,
  ranges: [number, number][],
  rangeIndex: number,
): number {
  if (__DEV__) throwIfOutOfRange(fnName, rangeIndex, ranges.length - 1);
  return ranges[rangeIndex][valueIndex] || Infinity;
}

/**
 * Create a time range object given ranges of time.
 *
 * @param ranges - An array of time ranges.
 */
function buildTimeRanges(ranges?: [number, number][]): TimeRanges {
  if (isUndefined(ranges) || ranges.length === 0) {
    return { length: 0, start: emptyTimeRange, end: emptyTimeRange };
  }

  return {
    length: ranges.length,
    start: getRange.bind(null, 'start', 0, ranges),
    end: getRange.bind(null, 'end', 1, ranges),
  };
}

/**
 * Create a `TimeRanges` object
 *
 * @param start - The start of a single range (a number) or an
 * array of ranges (an array of arrays of two numbers each).
 * @param end - The end of a single range. Cannot be used with the array form of the
 * `start` argument.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges}
 */
export function createTimeRanges(start?: number | [number, number][], end?: number): TimeRanges {
  if (isArray(start)) {
    return buildTimeRanges(start);
  } else if (isUndefined(start) || isUndefined(end)) {
    return buildTimeRanges();
  }

  return buildTimeRanges([[start, end]]);
}

export function getTimeRangesStart(ranges: TimeRanges) {
  if (!ranges.length) return null;

  let min = ranges.start(0);

  for (let i = 1; i < ranges.length; i++) {
    const value = ranges.start(i);
    if (value < min) min = value;
  }

  return min;
}

export function getTimeRangesEnd(ranges: TimeRanges) {
  if (!ranges.length) return null;

  let max = ranges.end(0);

  for (let i = 1; i < ranges.length; i++) {
    const value = ranges.end(i);
    if (value > max) max = value;
  }

  return max;
}

function throwIfOutOfRange(fnName: 'start' | 'end', index: number, end: number) {
  if (!__DEV__) return;
  if (!isNumber(index) || index < 0 || index > end) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${end}).`,
    );
  }
}

function emptyTimeRange(): any {
  throw new Error(__DEV__ ? '`TimeRanges` object is empty.' : 'empty');
}
