export function isArrayEqual(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}
