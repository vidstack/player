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

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @template T
 * @template {(keyof T)[]} R
 * @param {T} obj
 * @param {R} keys
 * @returns {Pick<T, import("../utils").ArrayElement<R>>}
 */
export function pick(obj, keys) {
  return keys.reduce(
    (newObj, key) => ({
      ...newObj,
      [key]: obj[key]
    }),
    /** @type {any} */ ({})
  );
}

/**
 * The opposite of `pick`; this method creates an `object` composed of the own and inherited
 * enumerable property paths of object that are not omitted.
 *
 * @template T
 * @template {(keyof T)[]} R
 * @param {T} obj
 * @param {R} keys
 * @returns {Omit<T, import("../utils").ArrayElement<R>>}
 */
export function omit(obj, keys) {
  return /** @type {R} */ (Object.keys(obj))
    .filter((key) => keys.indexOf(key) < 0)
    .reduce(
      (newObj, key) => ({
        ...newObj,
        [key]: obj[key]
      }),
      /** @type {any} */ ({})
    );
}
