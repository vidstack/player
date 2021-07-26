import { ArrayElement } from '@helpers';

export function keysOf<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @param obj
 * @param keys
 */
export function pick<T>(
  obj: T,
  keys: (keyof T)[]
): Pick<T, ArrayElement<typeof keys>> {
  return keys.reduce(
    (newObj, key) => ({
      ...newObj,
      [key]: obj[key]
    }),
    {} as any
  );
}

/**
 * The opposite of `pick`; this method creates an `object` composed of the own and inherited
 * enumerable property paths of object that are not omitted.
 *
 * @param obj
 * @param keys
 */
export function omit<T>(
  obj: T,
  keys: (keyof T)[]
): Omit<T, ArrayElement<typeof keys>> {
  return keysOf(obj)
    .filter((key) => keys.indexOf(key) < 0)
    .reduce(
      (newObj, key) => ({
        ...newObj,
        [key]: obj[key]
      }),
      {} as any
    );
}
