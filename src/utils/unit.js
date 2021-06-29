/**
 * No-operation (noop).
 *
 * @param {...*} [args]
 * @returns {void}
 */
export function noop(args) {}

/**
 * Whether two values are NOT equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export function notEqual(valueA, valueB) {
  // This ensures (valueB==NaN, valueA==NaN) always returns false.
  return valueB !== valueA && (valueB === valueB || valueA === valueA);
}

/**
 * Whether two values are equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export function equal(valueA, valueB) {
  return !notEqual(valueA, valueB);
}

/**
 * Checks if the given `value` is `null`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null}
 */
export function isNull(value) {
  return value === null;
}

/**
 * Checks if the given `value` is `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is undefined}
 */
export function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Checks if given `value` is `null` or `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null | undefined}
 */
export function isNil(value) {
  return isNull(value) || isUndefined(value);
}

/**
 * Returns the constructor of the given `value`.
 *
 * @template T
 * @param {unknown} value - The value to return the constructor of.
 * @returns {import("../foundation/types/utils").Constructor<T>}
 */
export function getConstructor(value) {
  // @ts-ignore
  return !isNil(value) ? value.constructor : undefined;
}

/**
 * Checks if the given `value` is classified as a `Object`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is object}
 */
export function isObject(value) {
  return getConstructor(value) === Object;
}

/**
 * Checks if the given `value` is classified as a `Number` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is number}
 */
export function isNumber(value) {
  return getConstructor(value) === Number && !Number.isNaN(value);
}

/**
 * Checks if the given `value` is classified as a `String` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is string}
 */
export function isString(value) {
  return getConstructor(value) === String;
}

/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is boolean}
 */
export function isBoolean(value) {
  return getConstructor(value) === Boolean;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is Function}
 */
export function isFunction(value) {
  return getConstructor(value) === Function;
}

/**
 * Checks if the given `value` is classified as an `Array` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is unknown[]}
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Checks if the given `value` is an instanceof the given `constructor`.
 *
 * @param {unknown} value - The value to check.
 * @param {import("../foundation/types/utils").Constructor<unknown>} constructor - The constructor to check against.
 * @returns {boolean}
 */
export function isInstanceOf(value, constructor) {
  return Boolean(value && constructor && value instanceof constructor);
}

/**
 * Checks if the given `value` prototype chain includes the given `object`.
 *
 * @param {object} value - The value whose prototype chain to check.
 * @param {import("../foundation/types/utils").Constructor<unknown>} object - The object to search for in the prototype chain.
 * @returns {boolean}
 */
export function isPrototypeOf(value, object) {
  return Boolean(
    value && object && Object.isPrototypeOf.call(object.prototype, value)
  );
}
