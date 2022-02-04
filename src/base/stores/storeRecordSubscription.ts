import type { ReactiveControllerHost } from 'lit';

import { Context, isContext } from '../context';
import { storeSubscription } from './storeSubscription';
import type { ReadableStoreRecord, StoreValue } from './types';

/**
 * Helper function to subscribe to an individual store record item for the life of the given
 * `host` element.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { storeRecordSubscription, mediaStoreContext } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     storeRecordSubscription(this, mediaStoreContext, 'paused', ($value) => {
 *       // ...
 *     });
 *   }
 * }
 * ```
 */
export function storeRecordSubscription<
  StoreRecord extends ReadableStoreRecord,
  Key extends keyof StoreRecord
>(
  host: ReactiveControllerHost & EventTarget,
  store: StoreRecord | Context<StoreRecord>,
  key: Key,
  onChange: (value: StoreValue<StoreRecord[Key]>) => void
) {
  if (isContext(store)) {
    const consumer = store.consume(host);

    let unsubscribe: () => void;

    host.addController({
      hostConnected: () => {
        unsubscribe = consumer.value[key].subscribe(onChange);
      },
      hostDisconnected: () => {
        unsubscribe?.();
      }
    });
  } else {
    return storeSubscription(host, store[key], onChange);
  }
}
