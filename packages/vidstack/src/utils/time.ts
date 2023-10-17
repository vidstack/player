/**
 * 🤖 This section was generously ~stolen from~... err... donated by Furf. Cheers!
 *
 * @see https://github.snooguts.net/david-furfero/reddit-media-player/blob/main/src/lib/formatTime/index.ts
 */

import { isNull } from 'maverick.js/std';

/**
 * Casts a number to a string and pads it to match the given `expectedLength`.
 *
 * @param num - A number to pad.
 * @param expectedLength - The expected length of the numbers as a string.
 */
export function padNumberWithZeroes(num: number, expectedLength: number): string {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;

  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }

  return str;
}

export type TimeUnit = 'hours' | 'minutes' | 'seconds' | 'fraction';

export type ParsedTime = {
  [P in TimeUnit]: number;
};

/**
 * Parses the given `duration` into the following units of time: hours, minutes,
 * seconds, fraction (fraction of a second).
 *
 * @param duration - The length of time to parse in seconds.
 */
export function parseTime(duration: number): ParsedTime {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc((duration % 3600) / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction,
  };
}

/**
 * Formats the given `duration` into a human readable form that can be displayed to the user.
 *
 * @param duration - The length of time to parse in seconds.
 * @param shouldPadHours - Whether to pad the hours to be length of 2.
 * @param shouldPadMinutes - Whether to pad the minutes to be length of 2.
 * @param shouldAlwaysShowHours - Whether to always show the hours unit.
 * @example `01:20 -> minutes:seconds`
 * @example `3:01:20 -> hours:minutes:seconds`
 * @example If `shouldPadHours` is `true` - `03:01:20`
 * @example If `shouldAlwaysShowHours` is `true` - `0:01:20`
 */
export function formatTime(
  duration: number,
  shouldPadHours: boolean | null = null,
  shouldPadMinutes: boolean | null = null,
  shouldAlwaysShowHours = false,
): string {
  const { hours, minutes, seconds } = parseTime(duration),
    paddedHours = shouldPadHours ? padNumberWithZeroes(hours, 2) : hours,
    paddedMinutes =
      shouldPadMinutes || (isNull(shouldPadMinutes) && duration >= 3600)
        ? padNumberWithZeroes(minutes, 2)
        : minutes,
    paddedSeconds = padNumberWithZeroes(seconds, 2);

  if (hours > 0 || shouldAlwaysShowHours) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Formats the given `duration` into human spoken form.
 *
 * @param duration - The length of time to parse in seconds.
 * @example `2 hour 3 min 4 sec`
 */
export function formatSpokenTime(duration: number): string {
  const spokenParts: string[] = [];
  const { hours, minutes, seconds } = parseTime(duration);

  if (hours > 0) {
    spokenParts.push(`${hours} hour`);
  }

  if (minutes > 0) {
    spokenParts.push(`${minutes} min`);
  }

  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} sec`);
  }

  return spokenParts.join(' ');
}

/**
 * Formats the given `duration` into a valid HTML5 duration as specified in the linked
 * spec below.
 *
 * @param duration - The length of time to parse in seconds.
 * @see {@link https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string}
 */
export function formatHtml5Duration(duration: number): string {
  const { hours, minutes, seconds, fraction } = parseTime(duration);
  return `PT${hours}H${minutes}M${seconds + fraction}S`;
}
