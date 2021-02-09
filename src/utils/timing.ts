import { isUndefined } from './unit';

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have
 * elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @param immediate - Whether the first function invocation should be immediate.
 */
export const debounce = (
  func: (...args: any[]) => void,
  wait = 1000,
  immediate = false,
) => {
  let timeout: number | undefined;

  return function executedFunction(this: any, ...args: any[]) {
    const context = this;

    const later = function delayedFunctionCall() {
      timeout = undefined;
      if (!immediate) func.apply(context, args as []);
    };

    const callNow = immediate && isUndefined(timeout);
    clearTimeout(timeout);
    timeout = setTimeout(later, wait) as any;
    if (callNow) func.apply(context, args as []);
  };
};
