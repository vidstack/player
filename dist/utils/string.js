/**
 * @template T
 * @param {T} o
 * @returns {(keyof T)[]}
 */
export function keysOf(o) {
  return /** @type {any} */ (Object.keys(o));
}
