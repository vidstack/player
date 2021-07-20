/**
 * Walk object prototype chain and collect all property names of the given `object`.
 *
 * @template T
 * @param {T & object} obj
 * @param {object} [BaseConstructor] Stop collecting property names at this prototype.
 * @returns {Set<(keyof T)>}
 */
export function getAllObjectPropertyNames<T>(obj: any, BaseConstructor?: object): Set<keyof T>;
