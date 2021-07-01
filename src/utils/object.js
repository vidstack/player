/**
 * Walk object prototype chain and collect all property names of the given `object`.
 *
 * @template T
 * @param {T & object} obj
 * @param {object} [BaseConstructor] Stop collecting property names at this prototype.
 * @returns {Set<(keyof T)>}
 */
export function getAllObjectPropertyNames(obj, BaseConstructor = Object) {
  const properties = new Set();

  let proto = obj;

  while (proto != BaseConstructor.prototype) {
    for (let name of Object.getOwnPropertyNames(proto)) {
      properties.add(name);
    }

    proto = Object.getPrototypeOf(proto);
  }

  return properties;
}
