import { Constructor } from '@helpers';

/**
 * No-operation (noop).
 *
 * @param {...any} args
 */
export function noop(...args: any[]) {}

/**
 * Whether two values are NOT equal.
 *
 * @param valueA
 * @param valueB
 */
export function notEqual(valueA: unknown, valueB: unknown): boolean {
  // This ensures (valueB==NaN, valueA==NaN) always returns false.
  return valueB !== valueA && (valueB === valueB || valueA === valueA);
}

/**
 * Whether two values are equal.
 *
 * @param valueA
 * @param valueB
 */
export function equal(valueA: unknown, valueB: unknown): boolean {
  return !notEqual(valueA, valueB);
}

/**
 * Checks if the given `value` is `null`.
 *
 * @param value The value to check.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if the given `value` is `undefined`.
 *
 * @param value - The value to check.
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

/**
 * Checks if given `value` is `null` or `undefined`.
 *
 * @param value - The value to check.
 */
export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

/**
 * Returns the constructor of the given `value`.
 *
 * @param value - The value to return the constructor of.
 */
export function getConstructor<T>(
  value: T
): T extends Constructor<infer C> ? C : unknown {
  // @ts-expect-error
  return !isNil(value) ? value.constructor : undefined;
}

/**
 * Checks if the given `value` is classified as a `Object`.
 *
 * @param value - The value to check.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(value: unknown): value is object {
  return getConstructor(value) === Object;
}

/**
 * Checks if the given `value` is classified as a `Number` object.
 *
 * @param value - The value to check.
 */
export function isNumber(value: unknown): value is number {
  return getConstructor(value) === Number && !Number.isNaN(value);
}

/**
 * Checks if the given `value` is classified as a `String` object.
 *
 * @param value - The value to check.
 */
export function isString(value: unknown): value is string {
  return getConstructor(value) === String;
}

/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param value - The value to check.
 */
export function isBoolean(value: unknown): value is boolean {
  return getConstructor(value) === Boolean;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param value - The value to check.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return getConstructor(value) === Function;
}

/**
 * Checks if the given `value` is classified as an `Array` object.
 *
 * @param value - The value to check.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if the given `value` is an instanceof the given `constructor`.
 *
 * @param value - The value to check.
 * @param constructor - The constructor to check against.
 */
export function isInstanceOf(
  value: unknown,
  constructor: Constructor<unknown>
): boolean {
  return Boolean(value && constructor && value instanceof constructor);
}

/**
 * Checks if the given `value` prototype chain includes the given `object`.
 *
 * @param value - The value whose prototype chain to check.
 * @param object - The object to search for in the prototype chain.
 */
export function isPrototypeOf(
  // eslint-disable-next-line @typescript-eslint/ban-types
  value: object,
  object: Constructor<unknown>
): boolean {
  return Boolean(
    value && object && Object.isPrototypeOf.call(object.prototype, value)
  );
}
