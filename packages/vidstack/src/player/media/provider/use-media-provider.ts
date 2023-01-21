import { createContext, effect, ReadSignal, signal, useContext } from 'maverick.js';

import type { MediaProviderElement } from './types';

export const MediaProviderContext = createContext(() => signal<MediaProviderElement | null>(null));

export function useMediaProvider($target: ReadSignal<MediaProviderElement | null>): void {
  const $mediaProvider = useContext(MediaProviderContext);
  effect(() => void $mediaProvider.set($target()));
}
