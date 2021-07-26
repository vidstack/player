import { isUndefined } from './unit';

export type DebouncedFunction<Fn extends (...args: any) => void> = Fn & {
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
 * @link https://github.com/jashkenas/underscore/blob/master/modules/debounce.js
 */
export function debounce<Fn extends (...args: any) => void>(
  func: Fn,
  delay: number,
  immediate = false
): DebouncedFunction<Fn> {
  let timerId: number | undefined;

  let currentThis: unknown;

  let currentArgs: any[] | undefined;

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
      if (!immediate) {
        func.apply(currentThis, currentArgs as any);
      }

      // This check is needed because `func` can recursively invoke `debounced`.
      if (!pending()) clearContext();
    }
  };

  function debounced(this: any, ...args: any[]) {
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

  return debounced as DebouncedFunction<Fn>;
}

export type ThorttleOptions = {
  leading: boolean;
  trailing: boolean;
};

export type ThrottledFunction<Fn extends (...args: any) => void> = Fn & {
  cancel: () => void;
  pending: () => boolean;
  updateDelay: (delay: number) => void;
};

/**
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 *
 * @param func - The function to throttle.
 * @param delay - The number of milliseconds to throttle invocations by.
 * @param options - The throttle options.
 * @link https://github.com/jashkenas/underscore/blob/master/modules/throttle.js
 */
export function throttle<Fn extends (...args: any) => void>(
  func: Fn,
  delay: number,
  options: ThorttleOptions = { leading: false, trailing: false }
): ThrottledFunction<Fn> {
  let timerId: number | undefined;

  let currentThis: unknown;

  let currentArgs: any[] | undefined;

  let lastCallTime = 0;

  let currentDelay = delay;

  const pending = () => !isUndefined(timerId);

  const cancel = () => {
    clearTimer();
    clearContext();
  };

  const updateDelay = (delay: number) => {
    cancel();
    currentDelay = delay;
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
    func.apply(currentThis, currentArgs as any);
    if (!pending()) clearContext();
  };

  const ding = (time: number) => {
    if (pending()) clearTimer();
    lastCallTime = time;
    func.apply(currentThis, currentArgs as any);
    if (!pending()) clearContext();
  };

  function throttled(this: any, ...args: any[]) {
    const now = Date.now();

    if (lastCallTime === 0 && !options.leading) lastCallTime = now;

    const remainingTime = currentDelay - (now - lastCallTime);
    const hasDinged = remainingTime <= 0 || remainingTime > currentDelay;

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
  throttled.updateDelay = updateDelay;

  return throttled as ThrottledFunction<Fn>;
}

export type RafThrottledFunction<Fn extends (...args: any) => void> = Fn & {
  cancel: () => void;
  pending: () => boolean;
};

/**
 * Creates a throttled function that only invokes `func` at most once per animation frame.
 *
 * @param func - The function to throttle.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
export function rafThrottle<Fn extends (...args: any[]) => void>(
  func: Fn
): RafThrottledFunction<Fn> {
  let rafId: number | undefined;

  const pending = () => !isUndefined(rafId);

  const cancel = () => {
    if (isUndefined(rafId)) return;
    window.cancelAnimationFrame(rafId);
    rafId = undefined;
  };

  function throttled(this: any, ...args: any[]) {
    if (pending()) return;
    rafId = window.requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = undefined;
    });
  }

  throttled.cancel = cancel;
  throttled.pending = pending;

  return throttled as RafThrottledFunction<Fn>;
}
