import { deferredPromise } from 'maverick.js/std';

export function timedPromise<Resolved, Rejected>(callback: () => Rejected | void, ms = 3000) {
  const promise = deferredPromise<Resolved, Rejected>();

  setTimeout(() => {
    const rejection = callback();
    if (rejection !== undefined) promise.reject(rejection);
    else promise.resolve();
  }, ms);

  return promise;
}
