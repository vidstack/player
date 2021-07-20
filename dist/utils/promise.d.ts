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
export function deferredPromise<ResolveType, RejectType>(): DeferredPromise<ResolveType, RejectType>;
/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} timeout
 * @param {string} timeoutMsg
 * @returns {Promise<T>}
 */
export function timedPromise<T>(promise: Promise<T>, timeout: number, timeoutMsg: string): Promise<T>;
export type DeferredPromise<ResolveType, RejectType> = {
    promise: Promise<ResolveType | undefined>;
    resolve: (value?: ResolveType | undefined) => void;
    reject: (reason: RejectType) => void;
};
