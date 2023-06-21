/**
 * @see https://github.com/videojs/video.js/blob/main/src/js/utils/time-ranges.js
 */
import { isArray, isNumber, isUndefined } from 'maverick.js/std';

export class TimeRange implements TimeRanges {
  private readonly _ranges: [number, number][];

  get length() {
    return this._ranges.length;
  }

  constructor(start?: number | [number, number][], end?: number) {
    if (isArray(start)) {
      this._ranges = start;
    } else if (!isUndefined(start) && !isUndefined(end)) {
      this._ranges = [[start, end]];
    } else {
      this._ranges = [];
    }
  }

  start(index: number): number {
    if (__DEV__) throwIfEmpty(this._ranges.length);
    if (__DEV__) throwIfOutOfRange('start', index, this._ranges.length - 1);
    return this._ranges[index][0] ?? Infinity;
  }

  end(index: number): number {
    if (__DEV__) throwIfEmpty(this._ranges.length);
    if (__DEV__) throwIfOutOfRange('end', index, this._ranges.length - 1);
    return this._ranges[index][1] ?? Infinity;
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
