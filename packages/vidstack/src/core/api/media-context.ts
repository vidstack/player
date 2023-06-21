import {
  createContext,
  useContext,
  type ReadSignal,
  type ReadSignalRecord,
  type Scope,
  type WriteSignal,
} from 'maverick.js';

import type { MediaPlayer } from '../../components/player';
import type { Logger } from '../../foundation/logger/controller';
import type { MediaProviderAdapter } from '../../providers/types';
import type { MediaKeyShortcuts } from '../keyboard/types';
import type { VideoQualityList } from '../quality/video-quality';
import type { MediaPlayerDelegate } from '../state/media-player-delegate';
import type { MediaRemoteControl } from '../state/remote-control';
import type { AudioTrackList } from '../tracks/audio-tracks';
import type { TextRenderers } from '../tracks/text/render/text-renderer';
import type { TextTrackList } from '../tracks/text/text-tracks';
import type { MediaPlayerProps } from './player-props';
import type { PlayerStore } from './player-state';

export interface MediaContext {
  player: MediaPlayer;
  scope: Scope;
  remote: MediaRemoteControl;
  delegate: MediaPlayerDelegate;
  qualities: VideoQualityList;
  audioTracks: AudioTrackList;
  textTracks: TextTrackList;
  textRenderers: TextRenderers;
  ariaKeys: MediaKeyShortcuts;
  logger?: Logger;
  $provider: WriteSignal<MediaProviderAdapter | null>;
  $iosControls: ReadSignal<boolean>;
  $props: ReadSignalRecord<MediaPlayerProps>;
  $state: PlayerStore;
  activeMenu?: {
    close(trigger?: Event): void;
  } | null;
}

export const mediaContext = createContext<MediaContext>();

export function useMediaContext(): MediaContext {
  return useContext(mediaContext);
}
