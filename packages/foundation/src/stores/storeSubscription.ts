import { type ReactiveControllerHost } from 'lit';

import { type Context, ContextConsumerController, isContext } from '../context';
import { type ReadableStore } from './types';

export type StoreSubscriptionHost = ReactiveControllerHost & Node;

/**
 * Helper function to subscribe to a store for the life of the given `host` element, meaning
 * when it's disconnected from the DOM, the subscription is destroyed.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { storeSubscription } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     storeSubscription(this, <<store>>, ($value) => {
 *       // ...
 *     });
 *   }
 * }
 * ```
 */
export function storeSubscription<T>(
  host: StoreSubscriptionHost,
  store: ReadableStore<T> | Context<ReadableStore<T>>,
  onChange: (value: T) => void,
) {
  let consumer: ContextConsumerController<ReadableStore<T>> | undefined;

  let unsubscribe: () => void;

  const subscribe = () => {
    unsubscribe = (consumer?.value ?? (store as ReadableStore<T>)).subscribe(onChange);
  };

  if (isContext<Context<ReadableStore<T>>>(store)) {
    consumer = store.consume(host);
  }

  host.addController({
    hostConnected() {
      if (isContext(store)) {
        consumer!.whenRegistered(subscribe);
      } else {
        subscribe();
      }
    },
    hostDisconnected() {
      unsubscribe?.();
    },
  });
}
