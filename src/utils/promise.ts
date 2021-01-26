export interface DeferredPromise<T> {
  promise: Promise<T>;
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
}

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

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export const cancellablePromise = <T>(
  promise: Promise<T>,
): CancellablePromise<T> => {
  let rejectFn: (reason?: any) => void;

  const wrappedPromise: any = new Promise((resolve, reject) => {
    rejectFn = reject;

    Promise.resolve(promise).then(resolve).catch(reject);
  });

  wrappedPromise.cancel = () => {
    rejectFn(Error('Cancelled.'));
  };

  return wrappedPromise;
};
