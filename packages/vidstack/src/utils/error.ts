export function coerceToError(error: unknown) {
  return error instanceof Error
    ? error
    : Error(typeof error === 'string' ? error : JSON.stringify(error));
}

export function assert(condition: any, message?: string | false): asserts condition {
  if (!condition) {
    throw Error(message || 'Assertion failed.');
  }
}
