import { isUndefined } from './unit';

export type RafThrottledFunction<Fn extends (...args: any) => void> = Fn & {
  cancel: () => void;
  pending: () => boolean;
};

export function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

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
