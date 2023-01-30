import { createContext, useContext, WriteSignal } from 'maverick.js';

import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement } from '../element/types';
import type { MediaControllerDelegate } from './controller/controller-delegate';
import type { MediaProvider, MediaProviderLoader } from './providers/types';
import type { MediaStore } from './store';

export interface MediaContext {
  $player: WriteSignal<MediaPlayerElement | null>;
  $loader: WriteSignal<MediaProviderLoader | null>;
  $provider: WriteSignal<MediaProvider | null>;
  $store: MediaStore;
  delegate: MediaControllerDelegate;
  logger?: Logger;
}

export const mediaContext = createContext<MediaContext>();

export function useMedia(): MediaContext {
  return useContext(mediaContext);
}

export function useMediaStore(): Readonly<MediaStore> {
  return useContext(mediaContext).$store;
}
