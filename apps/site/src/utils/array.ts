export function shuffleArray<T>(array: T[]): T[] {
  let items = array.length;

  while (items) {
    const i = Math.floor(Math.random() * items--);
    [array[items], array[i]] = [array[i], array[items]];
  }

  return array;
}
