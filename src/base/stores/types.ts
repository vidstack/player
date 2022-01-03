/** Callback to inform of a value updates. */
export type StoreSubscriber<T> = (value: T) => void;

/** Unsubscribes from value updates. */
export type StoreUnsubscriber = () => void;

/** Callback to update a value. */
export type StoreUpdater<T> = (value: T) => T;

/** Cleanup logic callback. */
export type StoreInvalidator<T> = (value?: T) => void;

/** Start and stop notification callbacks. */
export type StoreStartStopNotifier<T> = (
  set: StoreSubscriber<T>
) => StoreUnsubscriber | void;

/** Readable interface for subscribing. */
export type ReadableStore<T> = {
  initialValue: T | undefined;

  /**
   * Subscribe on value changes.
   * @param run subscription callback
   * @param invalidate cleanup callback
   */
  subscribe(
    this: void,
    run: StoreSubscriber<T>,
    invalidate?: StoreInvalidator<T>
  ): StoreUnsubscriber;
};

/** Writable interface for both updating and subscribing. */
export type WritableStore<T> = ReadableStore<T> & {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void;

  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: StoreUpdater<T>): void;
};

/** Pair of subscriber and invalidator. */
export type SubscribeInvalidateTuple<T> = [
  StoreSubscriber<T>,
  StoreInvalidator<T>
];

export type ReadableStoreRecord = {
  [prop: string]: ReadableStore<any>;
};

export type WritableStoreRecord = {
  [prop: string]: WritableStore<any>;
};

export type StoreValue<T> = T extends ReadableStore<infer U> ? U : never;

/** One or more `Readable`s. */
export type Stores =
  | ReadableStore<any>
  | [ReadableStore<any>, ...Array<ReadableStore<any>>]
  | Array<ReadableStore<any>>;

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends ReadableStore<infer U>
  ? U
  : { [K in keyof T]: T[K] extends ReadableStore<infer U> ? U : never };
