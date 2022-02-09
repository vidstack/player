import { noop } from './unit';

export type DeferredPromise<ResolveType = void, RejectType = void> = {
  promise: Promise<ResolveType | undefined>;
  resolve: (value?: ResolveType) => void;
  reject: (reason: RejectType) => void;
};

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export function deferredPromise<
  ResolveType = void,
  RejectType = void
>(): DeferredPromise<ResolveType, RejectType> {
  let resolve: (value: ResolveType | undefined) => void = noop;

  let reject: (reason: RejectType) => void = noop;

  const promise: Promise<ResolveType | undefined> = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Wraps a promise so it can timeout.
 *
 * @param promise
 * @param timeout
 * @param timeoutMsg
 */
export function timedPromise<T>(
  promise: Promise<T>,
  timeout: number,
  timeoutMsg: string
): Promise<T> {
  const timer = new Promise((_, reject) => {
    const timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);
      reject(timeoutMsg);
    }, timeout);
  });

  return Promise.race([promise, timer]) as Promise<T>;
}
