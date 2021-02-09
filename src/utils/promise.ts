export interface DeferredPromise<T> {
  promise: Promise<T>;
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
}

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export const deferredPromise = <T = any>(): DeferredPromise<T> => {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-ignore
  return { promise, resolve, reject };
};
