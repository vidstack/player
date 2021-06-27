/**
 * @inspiration https://github.com/videojs/video.js/blob/main/src/js/utils/time-ranges.js
 */

import { isArray, isNumber, isUndefined } from '../utils/unit.js';

/**
 * Check if any of the time ranges are over the maximum index.
 *
 * @param {'start' | 'end'} fnName - The function name to use for logging.
 * @param {number} index - The index to check.
 * @param {number} maxIndex - The maximum possible index.
 * @returns {void}
 * @throws {Error} - Will throw if index is out of bounds or non-numeric.
 */
function rangeCheck(fnName, index, maxIndex) {
  if (!isNumber(index) || index < 0 || index > maxIndex) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${maxIndex}).`
    );
  }
}

/**
 * Get the time for the specified index at the start or end of a `TimeRanges` object.
 *
 * @param {'start' | 'end'} fnName - The function name to use for logging.
 * @param {0 | 1} valueIndex - The property that should be used to get the time. should be  0 for 'start' or  1 for 'end'.
 * @param {[number, number][]} ranges - An array of time ranges.
 * @param {number} rangeIndex - The index to start the search at.
 * @returns {number}
 */
function getRange(fnName, valueIndex, ranges, rangeIndex) {
  rangeCheck(fnName, rangeIndex, ranges.length - 1);
  return ranges[rangeIndex][valueIndex];
}

/**
 * Create a time range object given ranges of time.
 *
 * @param {[number, number][]} [ranges] - An array of time ranges.
 * @returns {TimeRanges}
 */
function createTimeRangesObj(ranges) {
  if (isUndefined(ranges) || ranges.length === 0) {
    return {
      length: 0,
      start() {
        throw new Error('This TimeRanges object is empty');
      },
      end() {
        throw new Error('This TimeRanges object is empty');
      }
    };
  }

  return {
    length: ranges.length,
    start: getRange.bind(null, 'start', 0, ranges),
    end: getRange.bind(null, 'end', 1, ranges)
  };
}

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
export function createTimeRanges(start, end) {
  if (isArray(start)) {
    return createTimeRangesObj(start);
  } else if (isUndefined(start) || isUndefined(end)) {
    return createTimeRangesObj();
  }

  return createTimeRangesObj([[start, end]]);
}
