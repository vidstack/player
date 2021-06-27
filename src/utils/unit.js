/**
 * No-operation (noop).
 *
 * @param {...*} [args]
 * @returns {void}
 */
export const noop = (args) => {};

/**
 * Whether two values are NOT equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export const notEqual = (valueA, valueB) => {
  // This ensures (valueB==NaN, valueA==NaN) always returns false.
  return valueB !== valueA && (valueB === valueB || valueA === valueA);
};

/**
 * Whether two values are equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export const equal = (valueA, valueB) => {
  return !notEqual(valueA, valueB);
};

/**
 * Checks if the given `value` is `null`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null}
 */
export const isNull = (value) => value === null;

/**
 * Checks if the given `value` is `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is undefined}
 */
export const isUndefined = (value) => typeof value === 'undefined';

/**
 * Checks if given `value` is `null` or `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null | undefined}
 */
export const isNil = (value) => isNull(value) || isUndefined(value);

/**
 * Returns the constructor of the given `value`.
 *
 * @template T
 * @param {unknown} value - The value to return the constructor of.
 * @returns {import("../foundation/types/utils").Constructor<T>}
 */
export const getConstructor = (value) =>
  // @ts-ignore
  !isNil(value) ? value.constructor : undefined;

/**
 * Checks if the given `value` is classified as a `Object`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is object}
 */
export const isObject = (value) => getConstructor(value) === Object;

/**
 * Checks if the given `value` is classified as a `Number` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is number}
 */
export const isNumber = (value) =>
  getConstructor(value) === Number && !Number.isNaN(value);

/**
 * Checks if the given `value` is classified as a `String` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is string}
 */
export const isString = (value) => getConstructor(value) === String;

/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is boolean}
 */
export const isBoolean = (value) => getConstructor(value) === Boolean;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is Function}
 */
export const isFunction = (value) => getConstructor(value) === Function;

/**
 * Checks if the given `value` is classified as an `Array` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is unknown[]}
 */
export const isArray = (value) => Array.isArray(value);

/**
 * Checks if the given `value` is an instanceof the given `constructor`.
 *
 * @param {unknown} value - The value to check.
 * @param {import("../foundation/types/utils").Constructor<unknown>} constructor - The constructor to check against.
 * @returns {boolean}
 */
export const isInstanceOf = (value, constructor) =>
  Boolean(value && constructor && value instanceof constructor);

/**
 * Checks if the given `value` prototype chain includes the given `object`.
 *
 * @param {object} value - The value whose prototype chain to check.
 * @param {import("../foundation/types/utils").Constructor<unknown>} object - The object to search for in the prototype chain.
 * @returns {boolean}
 */
export const isPrototypeOf = (value, object) =>
  Boolean(
    value && object && Object.isPrototypeOf.call(object.prototype, value)
  );
