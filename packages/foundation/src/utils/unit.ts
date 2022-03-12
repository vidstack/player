export function noop(...args: any[]) {}

export function notEqual(valueA: unknown, valueB: unknown): boolean {
  // This ensures (valueB==NaN, valueA==NaN) always returns false.
  return valueB !== valueA && (valueB === valueB || valueA === valueA);
}

export function safeNotEqual(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

export function equal(valueA: unknown, valueB: unknown): boolean {
  return !notEqual(valueA, valueB);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

export function isObject(value: any): value is object {
  return value?.constructor === Object;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function createRegex(regex: string | RegExp) {
  return isString(regex) ? new RegExp(regex) : regex;
}

export function isWindow(value: unknown): value is Window {
  return value === window;
}
