import { noop } from './unit';

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 *
 * @template ResolveType
 * @template RejectType
 * @returns {import('./promise.types').DeferredPromise<ResolveType, RejectType>}
 */
export const deferredPromise = () => {
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
};
