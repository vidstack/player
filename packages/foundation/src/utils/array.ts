import { isNull, isUndefined } from './unit';

export function filterUnique<T>(
  items: T[],
  key: keyof T,
  options: {
    removeNull?: boolean;
    removeUndefined?: boolean;
    onDuplicateFound?: (item: T) => void;
  } = {},
): T[] {
  const seen = new Set();

  return items.filter((item) => {
    if (options.removeNull && isNull(item[key])) return false;
    if (options.removeUndefined && isUndefined(item[key])) return false;

    const isUnique = !seen.has(item[key]);

    if (!isUnique) {
      options.onDuplicateFound?.(item);
    }

    seen.add(item[key]);

    return isUnique;
  });
}
