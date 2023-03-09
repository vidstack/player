import { createContext, ReadSignal, useContext, WriteSignal } from 'maverick.js';

import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement } from '../element/types';
import type { AudioTrackList } from './audio-tracks';
import type { MediaControllerDelegate } from './controller/controller-delegate';
import type { MediaProvider, MediaProviderLoader } from './providers/types';
import type { MediaRemoteControl } from './remote-control';
import type { MediaStore } from './store';
import type { MediaKeyShortcuts } from './types';
import type { VideoQualityList } from './video-quality';

export interface MediaContext {
  $player: WriteSignal<MediaPlayerElement | null>;
  $loader: WriteSignal<MediaProviderLoader | null>;
  $provider: WriteSignal<MediaProvider | null>;
  $keyShortcuts: ReadSignal<MediaKeyShortcuts>;
  $store: MediaStore;
  remote: MediaRemoteControl;
  delegate: MediaControllerDelegate;
  qualities: VideoQualityList;
  audioTracks: AudioTrackList;
  ariaKeys: MediaKeyShortcuts;
  logger?: Logger;
}

export const mediaContext = createContext<MediaContext>();

export function useMedia(): MediaContext {
  return useContext(mediaContext);
}
