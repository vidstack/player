/**
 * @inspiration https://github.com/videojs/video.js/blob/main/src/js/utils/time-ranges.js
 */

import { isArray, isUndefined } from '../utils/unit';

/**
 * Check if any of the time ranges are over the maximum index.
 *
 * @param fnName - The function name to use for logging.
 * @param index - The index to check.
 * @param maxIndex - The maximum possible index.
 */
function rangeCheck(
  fnName: 'start' | 'end',
  index: number,
  maxIndex: number,
): void {
  if (typeof index !== 'number' || index < 0 || index > maxIndex) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${maxIndex}).`,
    );
  }
}

/**
 * Get the time for the specified index at the start or end of a `TimeRanges` object.
 *
 * @param fnName - The function name to use for logging.
 * @param valueIndex - The property that should be used to get the time. should be  0 for 'start' or  1 for 'end'.
 * @param ranges - An array of time ranges.
 * @param rangeIndex - The index to start the search at.
 */
function getRange(
  fnName: 'start' | 'end',
  valueIndex: 0 | 1,
  ranges: [number, number][],
  rangeIndex: number,
): number {
  rangeCheck(fnName, rangeIndex, ranges.length - 1);
  return ranges[rangeIndex][valueIndex];
}

/**
 * Create a time range object given ranges of time.
 *
 * @param ranges - An array of time ranges.
 */
function createTimeRangesObj(ranges?: [number, number][]): TimeRanges {
  if (isUndefined(ranges) || ranges.length === 0) {
    return {
      length: 0,
      start() {
        throw new Error('This TimeRanges object is empty');
      },
      end() {
        throw new Error('This TimeRanges object is empty');
      },
    };
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
 * @param start- The start of a single range (a number) or an array of ranges (an array of arrays
 * of two numbers each).
 *
 * @param end - The end of a single range. Cannot be used with the array form of the `start`
 * argument.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
 */
export function createTimeRanges(
  start?: number | [number, number][],
  end?: number,
): TimeRanges {
  if (isArray(start)) {
    return createTimeRangesObj(start);
  } else if (isUndefined(start) || isUndefined(end)) {
    return createTimeRangesObj();
  }

  return createTimeRangesObj([[start, end]]);
}
