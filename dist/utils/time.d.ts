/**
 * 🤖 This section was generously ~stolen from~... err... donated by Furf. Cheers!
 *
 * @see https://github.snooguts.net/david-furfero/reddit-media-player/blob/main/src/lib/formatTime/index.ts
 */
/**
 * Casts a number to a string and pads it to match the given `expectedLength`.
 *
 * @param {number} num - A number to pad.
 * @param {number} expectedLength - The expected length of the numbers as a string.
 * @returns {string}
 */
export function padNumberWithZeroes(num: number, expectedLength: number): string;
/**
 * @typedef {{ [P in TimeUnit]: number }} ParsedTime
 */
/**
 * Parses the given `duration` into the following units of time: hours, minutes,
 * seconds, fraction (fraction of a second).
 *
 * @param {number} duration - The length of time to parse in seconds.
 * @returns {ParsedTime}
 */
export function parseTime(duration: number): ParsedTime;
/**
 * Formats the given `duration` into a human readable form that can be displayed to the user.
 *
 * @param {number} duration - The length of time to parse in seconds.
 * @param {boolean} [shouldPadHours=false] - Whether to pad the hours to be length of 2.
 * @param {boolean} [shouldAlwaysShowHours=false] - Whether to always show the hours unit.
 * @returns {string}
 * @example `01:20` -> `minutes:seconds`
 * @example `3:01:20` -> `hours:minutes:seconds`
 * @example `03:01:20` -> If `shouldPadHours` is `true`
 * @example `0:01:20` -> If `shouldAlwaysShowHours` is `true`
 */
export function formatTime(duration: number, shouldPadHours?: boolean | undefined, shouldAlwaysShowHours?: boolean | undefined): string;
/**
 * Formats the given `duration` into human spoken form.
 *
 * @param {number} duration - The length of time to parse in seconds.
 * @returns {string}
 * @example `2 hours, 3 minutes, 4 seconds`
 */
export function formatSpokenTime(duration: number): string;
/**
 * Formats the given `duration` into a valid HTML5 duration as specified in the linked
 * spec below.
 *
 * @param {number} duration - The length of time to parse in seconds.
 * @returns {string}
 * @see https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
 */
export function formatHtml5Duration(duration: number): string;
export type TimeUnit = string;
export namespace TimeUnit {
    const Hours: string;
    const Minutes: string;
    const Seconds: string;
    const Fraction: string;
}
export type ParsedTime = {
    [x: string]: number;
};
