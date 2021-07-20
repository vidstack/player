/**
 * @template {unknown[]} Args
 * @typedef {{
 *  (this: unknown, ...args: Args): void;
 *  cancel: () => void;
 *  pending: () => boolean;
 * }} DebouncedFunction
 */
/**
 * @typedef {{
 *  leading: boolean;
 *  trailing: boolean;
 * }} ThorttleOptions
 */
/**
 * @template {unknown[]} Args
 * @typedef {{
 *  (this: unknown, ...args: Args): void;
 *  cancel: () => void;
 *  pending: () => boolean;
 * }} ThrottledFunction
 */
/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds have
 * elapsed since the last time the debounced function was invoked.
 *
 * @template {unknown[]} Args
 * @param {(...args: Args) => void} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @param {boolean} immediate - Whether the function should be triggered at the start of a sequence of calls instead of end.
 * @returns {DebouncedFunction<Args>}
 * @link https://github.com/jashkenas/underscore/blob/master/modules/debounce.js
 */
export function debounce<Args extends unknown[]>(func: (...args: Args) => void, delay: number, immediate?: boolean): DebouncedFunction<Args>;
/**
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 *
 * @template {unknown[]} Args
 * @param {(...args: Args) => void} func - The function to throttle.
 * @param {number} delay - The number of milliseconds to throttle invocations by.
 * @param {ThorttleOptions} options - The throttle options.
 * @returns {ThrottledFunction<Args>}
 * @link https://github.com/jashkenas/underscore/blob/master/modules/throttle.js
 */
export function throttle<Args extends unknown[]>(func: (...args: Args) => void, delay: number, options?: ThorttleOptions): ThrottledFunction<Args>;
export type DebouncedFunction<Args extends unknown[]> = {
    (this: unknown, ...args: Args): void;
    cancel: () => void;
    pending: () => boolean;
};
export type ThorttleOptions = {
    leading: boolean;
    trailing: boolean;
};
export type ThrottledFunction<Args extends unknown[]> = {
    (this: unknown, ...args: Args): void;
    cancel: () => void;
    pending: () => boolean;
};
