import {
  createContext,
  keysOf,
  type ReadableStore,
  storeRecordSubscription,
  type StoreSubscriptionHost,
  writable,
  type WritableStore,
} from '@vidstack/foundation';

import type { MediaContext } from './MediaContext';
import { MediaType } from './MediaType';
import { createTimeRanges } from './time-ranges';
import { ViewType } from './ViewType';

export type WritableMediaStoreRecord = {
  [Prop in keyof MediaContext]: WritableStore<MediaContext[Prop]>;
};

export type ReadableMediaStoreRecord = {
  [Prop in keyof MediaContext]: ReadableStore<MediaContext[Prop]>;
};

export const MEDIA_STORE_DEFAULTS: MediaContext = {
  autoplay: false,
  autoplayError: undefined,
  buffered: createTimeRanges(),
  duration: 0,
  bufferedAmount: 0,
  canLoad: false,
  canPlay: false,
  canFullscreen: false,
  controls: false,
  poster: '',
  currentSrc: '',
  currentTime: 0,
  ended: false,
  error: undefined,
  fullscreen: false,
  userIdle: false,
  loop: false,
  mediaType: MediaType.Unknown,
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  seekable: createTimeRanges(),
  seekableAmount: 0,
  seeking: false,
  src: [],
  started: false,
  viewType: ViewType.Unknown,
  volume: 1,
  waiting: false,
};

export function createMediaStore(): WritableMediaStoreRecord {
  const store = {};

  for (const prop of keysOf(MEDIA_STORE_DEFAULTS)) {
    store[prop] = writable(MEDIA_STORE_DEFAULTS[prop]);
  }

  return store as WritableMediaStoreRecord;
}

const DO_NOT_RESET_ON_SRC_CHANGE = new Set<keyof WritableMediaStoreRecord>([
  'autoplay',
  'canFullscreen',
  'canLoad',
  'controls',
  'currentSrc',
  'loop',
  'muted',
  'playsinline',
  'poster',
  'src',
  'viewType',
  'volume',
]);

/**
 * Resets all media state and leaves general player state intact (i.e., `autoplay`, `volume`, etc.).
 */
export function softResetMediaStore(store: WritableMediaStoreRecord) {
  keysOf(store).forEach((prop) => {
    if (!DO_NOT_RESET_ON_SRC_CHANGE.has(prop)) {
      (store[prop] as WritableStore<unknown>).set(store[prop].initialValue);
    }
  });
}

/**
 * Hard resets all media state in the store.
 */
export function resetMediaStore(store: WritableMediaStoreRecord) {
  for (const prop of keysOf(MEDIA_STORE_DEFAULTS)) {
    // @ts-expect-error - nonsense type error.
    store[prop].set(MEDIA_STORE_DEFAULTS[prop]);
  }
}

export const mediaStoreContext = createContext(createMediaStore);

/**
 * Helper function to simplify subscribing to a media store for the life of the given `host`
 * element, meaning when it's disconnected from the DOM, the subscription is destroyed.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { mediaStoreSubscription } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     mediaStoreSubscription(this, 'paused', ($paused) => {
 *       // ...
 *     });
 *   }
 * }
 * ```
 */
export function mediaStoreSubscription<T extends keyof ReadableMediaStoreRecord>(
  host: StoreSubscriptionHost,
  property: T,
  onChange: (value: MediaContext[T]) => void,
) {
  return storeRecordSubscription(host, mediaStoreContext, property, onChange);
}
