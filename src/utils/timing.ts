import { isUndefined } from './unit';

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
