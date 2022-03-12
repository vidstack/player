import {
  createContext,
  ReadableStore,
  storeRecordSubscription,
  writable,
  WritableStore,
} from '@vidstack/foundation';
import type { ReactiveControllerHost } from 'lit';

import type { MediaContext } from './MediaContext.js';
import { MediaType } from './MediaType.js';
import { createTimeRanges } from './time-ranges.js';
import { ViewType } from './ViewType.js';

export type WritableMediaStoreRecord = {
  [Prop in keyof MediaContext]: WritableStore<MediaContext[Prop]>;
};

export type ReadableMediaStoreRecord = {
  [Prop in keyof MediaContext]: ReadableStore<MediaContext[Prop]>;
};

export function createMediaStore(): WritableMediaStoreRecord {
  return {
    autoplay: writable(false),
    autoplayError: writable(undefined),
    buffered: writable(createTimeRanges()),
    duration: writable(0),
    bufferedAmount: writable(0),
    canLoad: writable(false),
    canPlay: writable(false),
    canFullscreen: writable(false),
    controls: writable(false),
    currentPoster: writable(''),
    currentSrc: writable(''),
    currentTime: writable(0),
    ended: writable(false),
    error: writable(undefined),
    fullscreen: writable(false),
    idle: writable(false),
    loop: writable(false),
    mediaType: writable(MediaType.Unknown),
    muted: writable(false),
    paused: writable(true),
    played: writable(createTimeRanges()),
    playing: writable(false),
    playsinline: writable(false),
    seekable: writable(createTimeRanges()),
    seekableAmount: writable(0),
    seeking: writable(false),
    started: writable(false),
    viewType: writable(ViewType.Unknown),
    volume: writable(1),
    waiting: writable(false),
  };
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
  host: ReactiveControllerHost & EventTarget,
  property: T,
  onChange: (value: MediaContext[T]) => void,
) {
  return storeRecordSubscription(host, mediaStoreContext, property, onChange);
}
