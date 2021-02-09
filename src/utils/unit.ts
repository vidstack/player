/**
 * Checks if `value` is `null`.
 *
 * @param value - The value to check.
 */
export const isNull = (value: any): value is null => value === null;

/**
 * Checks if `value` is `undefined`.
 *
 * @param value - The value to check.
 */
export const isUndefined = (value: any): value is undefined =>
  typeof value === 'undefined';

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param value - The value to check.
 */
export const isNil = (value: any): value is null | undefined =>
  isNull(value) || isUndefined(value);

/**
 * Returns the constructor of the given `value`.
 *
 * @param value - The value to return the constructor of.
 */
export const getConstructor = (value: any): object | undefined =>
  !isNil(value) ? value.constructor : undefined;

/**
 * Checks if `value` is classified as a `Object` object.
 *
 * @param value - The value to check.
 */
export const isObject = (value: any) => getConstructor(value) === Object;

/**
 * Checks if `value` is classified as a `Number` object.
 *
 * @param value - The value to check.
 */
export const isNumber = (value: any): value is number =>
  getConstructor(value) === Number && !Number.isNaN(value);

/**
 * Checks if `value` is classified as a `String` object.
 *
 * @param value - The value to check.
 */
export const isString = (value: any): value is string =>
  getConstructor(value) === String;

/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param value - The value to check.
 */
export const isBoolean = (value: any): value is boolean =>
  getConstructor(value) === Boolean;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param value - The value to check.
 */
export const isFunction = (value: any): value is Function =>
  getConstructor(value) === Function;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @param value - The value to check.
 */
export const isArray = (value: any): value is any[] => Array.isArray(value);

/**
 * Checks if `value` is an instanceof the given `constructor`.
 *
 * @param value - The value to check.
 * @param constructor - The constructor to check against.
 */
export const isInstanceOf = (value: any, constructor: any) =>
  Boolean(value && constructor && value instanceof constructor);

/**
 * Checks if the `value` prototype chain includes the given `object`.
 *
 * @param value - The value whose prototype chain to check.
 * @param object - The object to search for in the prototype chain.
 */
export const isPrototypeOf = (value: any, object: any) =>
  Boolean(
    value && object && Object.isPrototypeOf.call(object.prototype, value),
  );
