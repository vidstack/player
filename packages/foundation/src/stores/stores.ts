/**
 * From: https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
 * Documentation: https://svelte.dev/docs#run-time-svelte-store
 */

import { isFunction, noop, safeNotEqual } from '../utils/unit';
import {
  type ReadableStore,
  type StoreInvalidator,
  type Stores,
  type StoreStartStopNotifier,
  type StoreSubscriber,
  type StoresValues,
  type StoreUnsubscriber,
  type StoreUpdater,
  type SubscribeInvalidateTuple,
  type WritableStore,
} from './types';

const subscriberQueue: any[] = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 */
export function readable<T>(value?: T, start?: StoreStartStopNotifier<T>): ReadableStore<T> {
  return {
    initialValue: value,
    subscribe: writable(value, start).subscribe,
  };
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 */
export function writable<T>(value?: T, start: StoreStartStopNotifier<T> = noop): WritableStore<T> {
  let stop: StoreUnsubscriber | null;
  const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();

  function set(newValue: T): void {
    if (safeNotEqual(value, newValue)) {
      value = newValue;

      if (stop) {
        // store is ready
        const runQueue = !subscriberQueue.length;

        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriberQueue.push(subscriber, value);
        }

        if (runQueue) {
          for (let i = 0; i < subscriberQueue.length; i += 2) {
            subscriberQueue[i][0](subscriberQueue[i + 1]);
          }

          subscriberQueue.length = 0;
        }
      }
    }
  }

  function update(updater: StoreUpdater<T>): void {
    set(updater(value!));
  }

  function subscribe(
    run: StoreSubscriber<T>,
    invalidate: StoreInvalidator<T> = noop,
  ): StoreUnsubscriber {
    const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
    subscribers.add(subscriber);

    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }

    run(value!);

    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop?.();
        stop = null;
      }
    };
  }

  return { initialValue: value, set, update, subscribe };
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 */
export function derived<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>, set: (value: T) => void) => StoreUnsubscriber | void,
  initialValue?: T,
): ReadableStore<T>;

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 */
export function derived<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>) => T,
  initialValue?: T,
): ReadableStore<T>;

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 */
export function derived<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>) => T,
): ReadableStore<T>;

export function derived<T>(
  stores: Stores,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  initialValue?: T,
): ReadableStore<T> {
  const single = !Array.isArray(stores);

  const storesArray: Array<ReadableStore<any>> = single
    ? [stores as ReadableStore<any>]
    : (stores as Array<ReadableStore<any>>);

  const auto = fn.length < 2;

  return readable(initialValue, (set) => {
    let initialized = false;
    const values: T[] = [];

    let pending = 0;
    let cleanup = noop;

    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result as T);
      } else {
        cleanup = isFunction(result) ? (result as StoreUnsubscriber) : noop;
      }
    };

    const unsubscribers = storesArray.map((store, i) =>
      store.subscribe(
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (initialized) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        },
      ),
    );

    initialized = true;
    sync();

    return function stop() {
      unsubscribers.forEach((fn) => fn());
      cleanup();
    };
  });
}

function getStoreValue<T>(store: ReadableStore<T>): T {
  let value;
  store.subscribe((_) => (value = _))();
  return value;
}

export { getStoreValue as get };
