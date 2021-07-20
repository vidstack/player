/**
 * @template T
 * @param {T} o
 * @returns {(keyof T)[]}
 */
export function keysOf<T>(o: T): (keyof T)[];
