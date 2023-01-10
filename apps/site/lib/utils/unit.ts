export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isWindow(value: unknown): value is Window {
  return value === window;
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
