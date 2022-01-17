import type { ReactiveControllerHost } from 'lit';

import { createContext } from '../base/context';
import {
  hostedStoreRecordSubscription,
  ReadableStore,
  writable,
  WritableStore
} from '../base/stores';
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

export function createMediaStore(): WritableMediaStoreRecord {
  return {
    autoplay: writable(false),
    autoplayError: writable(undefined),
    buffered: writable(createTimeRanges()),
    duration: writable(0),
    bufferedAmount: writable(0),
    canRequestFullscreen: writable(false),
    canPlay: writable(false),
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
    waiting: writable(false)
  };
}

export const mediaStoreContext = createContext(createMediaStore);

export function hostedMediaStoreSubscription<
  T extends keyof ReadableMediaStoreRecord
>(
  host: ReactiveControllerHost & EventTarget,
  property: T,
  onChange: (value: MediaContext[T]) => void
) {
  return hostedStoreRecordSubscription(
    host,
    mediaStoreContext,
    property,
    // @ts-expect-error - ?
    onChange
  );
}
