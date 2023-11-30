import type { Scope } from 'maverick.js';

import type { MediaPlayer } from '../components/player';
import type { MediaContext } from '../core/api/media-context';
import type { MediaState } from '../core/api/player-state';
import type { MediaSrc, MediaType } from '../core/api/types';
import type { FullscreenAdapter } from '../foundation/fullscreen/controller';
import type { AudioProvider } from './audio/provider';
import type { HLSProvider } from './hls/provider';
import type { VideoProvider } from './video/provider';
import type { VimeoProvider } from './vimeo/provider';
import type { YouTubeProvider } from './youtube/provider';

export type AnyMediaProvider =
  | ({ type: 'audio' } & AudioProvider)
  | ({ type: 'video' } & VideoProvider)
  | ({ type: 'hls' } & HLSProvider)
  | ({ type: 'youtube' } & YouTubeProvider)
  | ({ type: 'vimeo' } & VimeoProvider);

export interface MediaProviderLoader<Provider extends MediaProviderAdapter = MediaProviderAdapter> {
  target: HTMLElement | null;
  canPlay(src: MediaSrc): boolean;
  mediaType(src?: MediaSrc): MediaType;
  preconnect?(ctx: MediaContext): void;
  load(ctx: MediaContext): Promise<Provider>;
}

export interface MediaProviderAdapter
  extends Readonly<
    Partial<
      Pick<
        MediaState,
        'paused' | 'muted' | 'currentTime' | 'volume' | 'playsinline' | 'playbackRate'
      >
    >
  > {
  readonly scope: Scope;
  readonly type: string;
  readonly currentSrc: MediaSrc | null;
  readonly fullscreen?: MediaFullscreenAdapter;
  readonly pictureInPicture?: MediaPictureInPictureAdapter;
  readonly canLiveSync?: boolean;
  preconnect?(ctx: MediaContext): void;
  setup(ctx: MediaSetupContext): void;
  destroy?(): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  setMuted(muted: boolean): void;
  setCurrentTime(time: number): void;
  setVolume(volume: number): void;
  setPlaysinline?(inline: boolean): void;
  setPlaybackRate?(rate: number): void;
  loadSource(src: MediaSrc, preload: MediaState['preload']): Promise<void>;
}

export interface MediaSetupContext extends MediaContext {
  player: MediaPlayer;
}

export interface MediaFullscreenAdapter extends FullscreenAdapter {}

export interface MediaPictureInPictureAdapter {
  /**
   * Whether picture-in-picture mode is active.
   */
  readonly active: boolean;
  /**
   * Whether picture-in-picture mode is supported. This does not mean that the operation is
   * guaranteed to be successful, only that it can be attempted.
   */
  readonly supported: boolean;
  /**
   * Request to display the current provider in picture-in-picture mode.
   */
  enter(): Promise<void | PictureInPictureWindow>;
  /**
   * Request to display the current provider in inline by exiting picture-in-picture mode.
   */
  exit(): Promise<void>;
}
