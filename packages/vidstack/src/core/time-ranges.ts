/**
 * @see https://github.com/videojs/video.js/blob/main/src/js/utils/time-ranges.js
 */
import { isArray, isNumber, isUndefined } from 'maverick.js/std';

export type TimeInterval = [start: number, end: number];

export class TimeRange implements TimeRanges {
  readonly #ranges: TimeInterval[];

  get length() {
    return this.#ranges.length;
  }

  constructor(start?: number | TimeInterval[], end?: number) {
    if (isArray(start)) {
      this.#ranges = start;
    } else if (!isUndefined(start) && !isUndefined(end)) {
      this.#ranges = [[start, end]];
    } else {
      this.#ranges = [];
    }
  }

  start(index: number): number {
    if (__DEV__) throwIfEmpty(this.#ranges.length);
    if (__DEV__) throwIfOutOfRange('start', index, this.#ranges.length - 1);
    return this.#ranges[index][0] ?? Infinity;
  }

  end(index: number): number {
    if (__DEV__) throwIfEmpty(this.#ranges.length);
    if (__DEV__) throwIfOutOfRange('end', index, this.#ranges.length - 1);
    return this.#ranges[index][1] ?? Infinity;
  }
}

export function getTimeRangesStart(range: TimeRanges) {
  if (!range.length) return null;

  let min = range.start(0);

  for (let i = 1; i < range.length; i++) {
    const value = range.start(i);
    if (value < min) min = value;
  }

  return min;
}

export function getTimeRangesEnd(range: TimeRanges) {
  if (!range.length) return null;

  let max = range.end(0);

  for (let i = 1; i < range.length; i++) {
    const value = range.end(i);
    if (value > max) max = value;
  }

  return max;
}

function throwIfEmpty(length: number) {
  if (!__DEV__) return;
  if (!length) throw new Error(__DEV__ ? '`TimeRanges` object is empty.' : 'empty');
}

function throwIfOutOfRange(fnName: 'start' | 'end', index: number, end: number) {
  if (!__DEV__) return;
  if (!isNumber(index) || index < 0 || index > end) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${end}).`,
    );
  }
}

export function normalizeTimeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length <= 1) {
    return intervals;
  }

  // Sort intervals based on the starting time.
  intervals.sort((a, b) => a[0] - b[0]);

  let normalized: TimeInterval[] = [],
    current: TimeInterval = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];

    // If the next interval overlaps or is adjacent, merge them.
    if (current[1] >= next[0] - 1) {
      current = [current[0], Math.max(current[1], next[1])];
    } else {
      normalized.push(current);
      current = next;
    }
  }

  // Push the last interval.
  normalized.push(current);

  return normalized;
}

export function updateTimeIntervals(
  intervals: TimeInterval[],
  interval: TimeInterval,
  value: number,
): TimeInterval {
  let start = interval[0],
    end = interval[1];

  if (value < start) {
    return [value, -1];
  } else if (value === start) {
    return interval;
  } else if (start === -1) {
    interval[0] = value;
    return interval;
  } else if (value > start) {
    interval[1] = value;
    if (end === -1) intervals.push(interval);
  }

  normalizeTimeIntervals(intervals);

  return interval;
}
