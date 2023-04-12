import { createContext, useContext, type ReadSignal, type WriteSignal } from 'maverick.js';

import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement, MediaPlayerProps } from '../element/types';
import type { MediaControllerDelegate } from './controller/controller-delegate';
import type { MediaProvider, MediaProviderLoader } from './providers/types';
import type { VideoQualityList } from './quality/video-quality';
import type { MediaRemoteControl } from './remote-control';
import type { MediaStore } from './store';
import type { AudioTrackList } from './tracks/audio-tracks';
import type { TextRenderers } from './tracks/text/render/text-renderer';
import type { TextTrackList } from './tracks/text/text-tracks';
import type { MediaKeyShortcuts } from './types';

export interface MediaContext {
  $player: WriteSignal<MediaPlayerElement | null>;
  $loader: WriteSignal<MediaProviderLoader | null>;
  $provider: WriteSignal<MediaProvider | null>;
  $keyShortcuts: ReadSignal<MediaKeyShortcuts>;
  $iosControls: ReadSignal<boolean>;
  $store: MediaStore;
  remote: MediaRemoteControl;
  delegate: MediaControllerDelegate;
  qualities: VideoQualityList;
  audioTracks: AudioTrackList;
  textTracks: TextTrackList;
  textRenderers: TextRenderers;
  ariaKeys: MediaKeyShortcuts;
  logger?: Logger;
  $$props: {
    $src: ReadSignal<MediaPlayerProps['src']>;
    $textTracks: ReadSignal<MediaPlayerProps['textTracks']>;
    $preferNativeHLS: ReadSignal<MediaPlayerProps['preferNativeHLS']>;
  };
}

export const mediaContext = createContext<MediaContext>();

export function useMedia(): MediaContext {
  return useContext(mediaContext);
}
