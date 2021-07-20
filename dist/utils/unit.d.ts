/**
 * No-operation (noop).
 *
 * @param {...*} [args]
 */
export function noop(args?: any[]): void;
/**
 * Whether two values are NOT equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export function notEqual(valueA: unknown, valueB: unknown): boolean;
/**
 * Whether two values are equal.
 *
 * @param {unknown} valueA
 * @param {unknown} valueB
 * @returns {boolean}
 */
export function equal(valueA: unknown, valueB: unknown): boolean;
/**
 * Checks if the given `value` is `null`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null}
 */
export function isNull(value: unknown): value is null;
/**
 * Checks if the given `value` is `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is undefined}
 */
export function isUndefined(value: unknown): value is undefined;
/**
 * Checks if given `value` is `null` or `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is null | undefined}
 */
export function isNil(value: unknown): value is null | undefined;
/**
 * Returns the constructor of the given `value`.
 *
 * @template T
 * @param {unknown} value - The value to return the constructor of.
 * @returns {import("../foundation/types").Constructor<T>}
 */
export function getConstructor<T>(value: unknown): import("../foundation/types").Constructor<T>;
/**
 * Checks if the given `value` is classified as a `Object`.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is object}
 */
export function isObject(value: unknown): value is any;
/**
 * Checks if the given `value` is classified as a `Number` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is number}
 */
export function isNumber(value: unknown): value is number;
/**
 * Checks if the given `value` is classified as a `String` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is string}
 */
export function isString(value: unknown): value is string;
/**
 * Checks if `value` is classified as a `Boolean` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is boolean}
 */
export function isBoolean(value: unknown): value is boolean;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is Function}
 */
export function isFunction(value: unknown): value is Function;
/**
 * Checks if the given `value` is classified as an `Array` object.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is unknown[]}
 */
export function isArray(value: unknown): value is unknown[];
/**
 * Checks if the given `value` is an instanceof the given `constructor`.
 *
 * @param {unknown} value - The value to check.
 * @param {import("../foundation/types").Constructor<unknown>} constructor - The constructor to check against.
 * @returns {boolean}
 */
export function isInstanceOf(value: unknown, constructor: import("../foundation/types").Constructor<unknown>): boolean;
/**
 * Checks if the given `value` prototype chain includes the given `object`.
 *
 * @param {object} value - The value whose prototype chain to check.
 * @param {import("../foundation/types").Constructor<unknown>} object - The object to search for in the prototype chain.
 * @returns {boolean}
 */
export function isPrototypeOf(value: object, object: import("../foundation/types").Constructor<unknown>): boolean;
