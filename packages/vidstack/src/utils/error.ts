export function coerceToError(error: unknown) {
  return error instanceof Error ? error : Error(JSON.stringify(error));
}
