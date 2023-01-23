import { createContext, signal, useContext, WriteSignal } from 'maverick.js';

import type { MediaElement } from './element/types';
import type { MediaProviderElement } from './provider/types';
import { mediaStore, MediaStore } from './store';

export interface MediaContext {
  $element: WriteSignal<MediaElement | null>;
  $provider: WriteSignal<MediaProviderElement | null>;
  $store: MediaStore;
}

export const mediaContext = createContext<MediaContext>(() => ({
  $element: signal<MediaElement | null>(null),
  $provider: signal<MediaProviderElement | null>(null),
  $store: mediaStore.create(),
}));

export function useMedia(): MediaContext {
  return useContext(mediaContext);
}

export function useMediaStore(): Readonly<MediaStore> {
  return useContext(mediaContext).$store;
}
