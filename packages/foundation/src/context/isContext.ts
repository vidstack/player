import { type Context } from './createContext';

// eslint-disable-next-line @typescript-eslint/ban-types
export function isContext<T extends Context<any>>(context: unknown | T): context is T {
  return (
    typeof (context as { id?: unknown })?.id === 'symbol' &&
    (context as { id: symbol }).id.description === '@vidstack/context'
  );
}
