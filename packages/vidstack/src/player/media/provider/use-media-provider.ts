import { effect, ReadSignal } from 'maverick.js';

import { useMedia } from '../context';
import type { MediaProviderElement } from './types';

export function useMediaProvider($target: ReadSignal<MediaProviderElement | null>): void {
  const $provider = useMedia().$provider;
  effect(() => void $provider.set($target()));
}
