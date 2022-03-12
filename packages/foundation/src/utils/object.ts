import { ArrayElement } from '../helper-types';

export function keysOf<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Creates an object composed of the picked `object` properties.
 */
export function pick<T>(obj: T, keys: (keyof T)[]): Pick<T, ArrayElement<typeof keys>> {
  return keys.reduce(
    (newObj, key) => ({
      ...newObj,
      [key]: obj[key],
    }),
    {} as any,
  );
}

/**
 * The opposite of `pick`; this method creates an `object` composed of the own and inherited
 * enumerable property paths of object that are not omitted.
 */
export function omit<T>(obj: T, keys: (keyof T)[]): Omit<T, ArrayElement<typeof keys>> {
  return keysOf(obj)
    .filter((key) => keys.indexOf(key) < 0)
    .reduce(
      (newObj, key) => ({
        ...newObj,
        [key]: obj[key],
      }),
      {} as any,
    );
}

/**
 * Whether the given `prop` is a direct property of the given object (`obj`).
 */
export const hasOwnProperty = <T>(obj: T, prop: keyof T): prop is keyof T =>
  Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Sorts an array of objects by a given property known as the sort key.
 */
export const sortObjectsBy = <T>(objects: T[], sortKey: keyof T): T[] =>
  objects.sort((a, b) => {
    if (a[sortKey] === b[sortKey]) return 0;
    return a[sortKey] < b[sortKey] ? -1 : 1;
  });
