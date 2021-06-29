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
 * Proxy whitelisted properties on `objA` to `objB`.
 *
 * @template T
 * @template R
 * @param {T & object} objA
 * @param {R & object} objB
 * @param {Set<keyof R>} whitelist
 * @returns {(() => void)} Cleanup function to remove proxy.
 */
export function proxyProperties(objA, objB, whitelist) {
  const proto = Object.getPrototypeOf(objA);
  const newProto = Object.create(proto);

  const proxy = new Proxy(newProto, {
    get(target, prop) {
      // Parent object has precedence.
      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop, objA);
      }

      if (whitelist.has(/** @type {any} */ (prop))) {
        return Reflect.get(objB, prop, objB);
      }

      return undefined;
    },
    set(target, prop, value) {
      let success = false;

      if (Reflect.has(target, prop)) {
        Reflect.set(target, prop, value, objA);
        success = true;
      }

      if (whitelist.has(/** @type {any} */ (prop))) {
        Reflect.set(objB, prop, value, objB);
        success = true;
      }

      return success;
    }
  });

  Object.setPrototypeOf(objA, proxy);

  return () => {
    let currentProto = objA;

    // Find the constructor in the proto chain for which the next prototype is the proxy we set.
    while (currentProto && Object.getPrototypeOf(currentProto) !== proxy) {
      currentProto = Object.getPrototypeOf(currentProto);
    }

    // If we find the proxy we set then remove it from the chain by skipping over it.
    if (currentProto) {
      Object.setPrototypeOf(
        currentProto,
        Object.getPrototypeOf(Object.getPrototypeOf(currentProto))
      );
    }
  };
}
