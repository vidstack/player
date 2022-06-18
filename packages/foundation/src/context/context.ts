import { ContextConsumerController, type ContextConsumerHost } from './ContextConsumerController';
import { ContextProviderController, type ContextProviderHost } from './ContextProviderController';

/**
 * Creates and returns a pairable context consumer and provider.
 */
export function createContext<T>(initValue: () => T): Context<T> {
  const id = Symbol('@vidstack/context');
  return {
    id,
    consume(host) {
      return new ContextConsumerController(host, initValue(), { id });
    },
    provide(host) {
      return new ContextProviderController(host, initValue, { id });
    },
  };
}

export interface Context<T> {
  readonly id: symbol;
  provide(host: ContextProviderHost): ContextProviderController<T>;
  consume(host: ContextConsumerHost): ContextConsumerController<T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isContext<T extends Context<any>>(context: unknown | T): context is T {
  return (
    typeof (context as { id?: unknown })?.id === 'symbol' &&
    (context as { id: symbol }).id.description === '@vidstack/context'
  );
}
