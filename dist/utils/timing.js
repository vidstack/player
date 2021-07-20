import { isUndefined } from './unit.js';
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
export function debounce(func, delay, immediate = false) {
  /** @type {number | undefined} */
  let timerId;
  /** @type {unknown} */
  let currentThis;
  /** @type {Args | undefined} */
  let currentArgs;
  /** @type {number} */
  let lastCallTime;
  const pending = () => !isUndefined(timerId);
  const cancel = () => {
    window.clearTimeout(timerId);
    timerId = undefined;
    clearContext();
  };
  const clearContext = () => {
    currentThis = undefined;
    currentArgs = undefined;
  };
  const handleTimeout = () => {
    const elapsedTime = Date.now() - lastCallTime;
    if (delay > elapsedTime) {
      timerId = window.setTimeout(handleTimeout, delay - elapsedTime);
    } else {
      timerId = undefined;
      if (!immediate)
        func.apply(currentThis, /** @type {Args} */ (currentArgs));
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!pending()) clearContext();
    }
  };
  /**
   * @this {unknown}
   * @param  {Args} args
   */
  function debounced(...args) {
    currentThis = this;
    currentArgs = args;
    lastCallTime = Date.now();
    if (!pending()) {
      timerId = window.setTimeout(handleTimeout, delay);
      if (immediate) func.apply(this, args);
    }
  }
  debounced.cancel = cancel;
  debounced.pending = pending;
  return debounced;
}
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
export function throttle(
  func,
  delay,
  options = { leading: false, trailing: false }
) {
  /** @type {number | undefined} */
  let timerId;
  /** @type {unknown} */
  let currentThis;
  /** @type {Args | undefined} */
  let currentArgs;
  /** @type {number} */
  let lastCallTime = 0;
  const pending = () => !isUndefined(timerId);
  const cancel = () => {
    clearTimer();
    clearContext();
  };
  const clearTimer = () => {
    window.clearTimeout(timerId);
    timerId = undefined;
    lastCallTime = 0;
  };
  const clearContext = () => {
    currentThis = undefined;
    currentArgs = undefined;
  };
  const handleTimeout = () => {
    lastCallTime = !options.leading ? 0 : Date.now();
    timerId = undefined;
    func.apply(currentThis, /** @type {Args} */ (currentArgs));
    if (!pending()) clearContext();
  };
  /**
   * @param {number} time
   */
  const ding = (time) => {
    if (pending()) clearTimer();
    lastCallTime = time;
    func.apply(currentThis, /** @type {Args} */ (currentArgs));
    if (!pending()) clearContext();
  };
  /**
   * @this {unknown}
   * @param {Args} args
   */
  function throttled(...args) {
    const now = Date.now();
    if (lastCallTime === 0 && !options.leading) lastCallTime = now;
    const remainingTime = delay - (now - lastCallTime);
    const hasDinged = remainingTime <= 0 || remainingTime > delay;
    currentThis = this;
    currentArgs = args;
    if (hasDinged) {
      ding(now);
    } else if (!pending() && options.trailing) {
      timerId = window.setTimeout(handleTimeout, remainingTime);
    }
  }
  throttled.cancel = cancel;
  throttled.pending = pending;
  return throttled;
}
