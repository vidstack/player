import { noop } from './unit.js';

/**
 * @template ResolveType
 * @template RejectType
 * @typedef {{
 *  promise: Promise<ResolveType | undefined>;
 *  resolve: (value?: ResolveType) => void;
 *  reject: (reason: RejectType) => void;
 * }} DeferredPromise
 */

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 *
 * @template ResolveType
 * @template RejectType
 * @returns {DeferredPromise<ResolveType, RejectType>}
 */
export function deferredPromise() {
  /** @type {(value: ResolveType | undefined) => void} */
  let resolve = noop;

  /** @type {(reason: RejectType) => void} */
  let reject = noop;

  /** @type {Promise<ResolveType | undefined>} */
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
