import { type Context } from './createContext';

// eslint-disable-next-line @typescript-eslint/ban-types
export function isContext(context: unknown): context is Context<unknown> {
  return (
    typeof (context as { id?: unknown })?.id === 'symbol' &&
    (context as { id: symbol }).id.description === '@vidstack/context'
  );
}
