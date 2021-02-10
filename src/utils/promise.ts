import { noop } from '@wcom/context';

export interface DeferredPromise<ResolveType, RejectType> {
  promise: Promise<ResolveType>;
  resolve: (value: ResolveType) => void;
  reject: (reason: RejectType) => void;
}

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export const deferredPromise = <ResolveType, RejectType>(): DeferredPromise<
  ResolveType,
  RejectType
> => {
  let resolve: (value: ResolveType | PromiseLike<ResolveType>) => void = noop;
  let reject: (reason: RejectType) => void = noop;

  const promise = new Promise<ResolveType>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
