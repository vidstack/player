import { createContext, effect, ReadSignal, signal, useContext } from 'maverick.js';

import type { MediaProviderElement } from './types';

export const mediaProviderContext = createContext(() => signal<MediaProviderElement | null>(null));

export function useMediaProvider($target: ReadSignal<MediaProviderElement | null>): void {
  const $mediaProvider = useContext(mediaProviderContext);
  effect(() => void $mediaProvider.set($target()));
}
