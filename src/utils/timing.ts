import { isUndefined } from './unit';

export type DebouncedFunction<Args extends unknown[]> = {
  (this: unknown, ...args: Args): void;
  cancel: () => void;
  pending: () => boolean;
};

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds have
 * elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param delay - The number of milliseconds to delay.
 * @param immediate - Whether the function should be triggered at the start of a sequence of calls instead of end.
 *
 * @link https://github.com/jashkenas/underscore/blob/master/modules/debounce.js
 */
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number,
  immediate = false,
): DebouncedFunction<Args> {
  let timerId: number | undefined;
  let currentThis: unknown;
  let currentArgs: Args | undefined;
  let lastCallTime: number;

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
      if (!immediate) func.apply(currentThis, currentArgs as Args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!pending()) clearContext();
    }
  };

  function debounced(this: unknown, ...args: Args) {
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

export type ThrottledFunction<Args extends unknown[]> = {
  (this: unknown, ...args: Args): void;
  cancel: () => void;
  pending: () => boolean;
};

export interface ThorttleOptions {
  leading: boolean;
  trailing: boolean;
}

/**
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 *
 * @param func - The function to throttle.
 * @param delay - The number of milliseconds to throttle invocations by.
 *
 * @link https://github.com/jashkenas/underscore/blob/master/modules/throttle.js
 */
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number,
  options: ThorttleOptions = { leading: false, trailing: false },
): ThrottledFunction<Args> {
  let timerId: number | undefined;
  let currentThis: unknown;
  let currentArgs: Args | undefined;
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
    func.apply(currentThis, currentArgs as Args);
    if (!pending()) clearContext();
  };

  const ding = (time: number) => {
    if (pending()) clearTimer();
    lastCallTime = time;
    func.apply(currentThis, currentArgs as Args);
    if (!pending()) clearContext();
  };

  function throttled(this: unknown, ...args: Args) {
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
