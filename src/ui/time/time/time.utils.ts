/**
 * 🤖 This section was generously ~stolen from~... err... donated by Furf. Cheers!
 *
 * @inspiration https://github.snooguts.net/david-furfero/reddit-media-player/blob/main/src/lib/formatTime/index.ts
 */

/**
 * Casts a number to a string and pads it to match the given `expectedLength`.
 *
 * @param num - A number to pad.
 * @param expectedLength - The expected length of the numbers as a string.
 */
export function padNumberWithZeroes(
  num: number,
  expectedLength: number,
): string {
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

export enum TimeUnit {
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
  /**
   * Represents a fraction of a second in decimal form.
   */
  Decimal = 'decimal',
}

export type ParsedTime = {
  [P in TimeUnit]: number;
};

/**
 * Parses the given `duration` into the following units of time: hours, minutes,
 * seconds, decimal (fraction of a second).
 *
 * @param duration - The length of time to parse in seconds.
 */
export function parseTime(duration: number): ParsedTime {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc((duration % 3600) / 60);
  const seconds = Math.trunc(duration % 60);
  const decimal = Number((duration - Math.trunc(duration)).toPrecision(3));

  return {
    [TimeUnit.Hours]: hours,
    [TimeUnit.Minutes]: minutes,
    [TimeUnit.Seconds]: seconds,
    [TimeUnit.Decimal]: decimal,
  };
}

/**
 * Formats the given `duration` into a human readable form that can be displayed to the user.
 *
 * @param duration - The length of time to parse in seconds.
 * @param shouldPadHours - Whether to pad the hours to be length of 2.
 * @param shouldAlwaysShowHours - Whether to always show the hours unit.
 *
 * @example `01:20` -> `minutes:seconds`
 * @example `3:01:20` -> `hours:minutes:seconds`
 * @example `03:01:20` -> If `shouldPadHours` is `true`
 * @example `0:01:20` -> If `shouldAlwaysShowHours` is `true`
 */
export const formatTime = (
  duration: number,
  shouldPadHours = false,
  shouldAlwaysShowHours = false,
): string => {
  const { hours, minutes, seconds } = parseTime(duration);
  const paddedHours = shouldPadHours ? padNumberWithZeroes(hours, 2) : hours;
  const paddedMinutes = padNumberWithZeroes(minutes, 2);
  const paddedSeconds = padNumberWithZeroes(seconds, 2);

  if (hours > 0 || shouldAlwaysShowHours) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
};

/**
 * Formats the given `duration` into human spoken form.
 *
 * @param duration - The length of time to parse in seconds.
 *
 * @example `2 hours, 3 minutes, 4 seconds`
 */
export const formatSpokenTime = (duration: number): string => {
  const spokenParts: string[] = [];
  const { hours, minutes, seconds } = parseTime(duration);

  const pluralize = (num: number, word: string) =>
    num === 1 ? word : `${word}s`;

  if (hours > 0) {
    spokenParts.push(`${hours} ${pluralize(hours, 'hour')}`);
  }

  if (minutes > 0) {
    spokenParts.push(`${minutes} ${pluralize(minutes, 'minute')}`);
  }

  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} ${pluralize(seconds, 'second')}`);
  }

  return spokenParts.join(', ');
};

/**
 * Formats the given `duration` into a valid HTML5 duration as specified in the linked
 * spec below.
 *
 * @param duration - The length of time to parse in seconds.
 *
 * @spec https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
 */
export const formatHtml5Duration = (duration: number): string => {
  const { hours, minutes, seconds, decimal } = parseTime(duration);
  return `PT${hours}H${minutes}M${seconds + decimal}S`;
};
