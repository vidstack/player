import type { Scope } from 'maverick.js';

import type { Src } from '../core';
import type { MediaContext } from '../core/api/media-context';
import type { MediaState } from '../core/api/player-state';
import type { MediaType } from '../core/api/types';
import type { FullscreenAdapter } from '../foundation/fullscreen/controller';
import type { AudioProvider } from './audio/provider';
import type { GoogleCastProvider } from './google-cast/provider';
import type { HLSProvider } from './hls/provider';
import type { VideoProvider } from './video/provider';
import type { VimeoProvider } from './vimeo/provider';
import type { YouTubeProvider } from './youtube/provider';

export type AnyMediaProvider =
  | ({ type: 'audio' } & AudioProvider)
  | ({ type: 'video' } & VideoProvider)
  | ({ type: 'hls' } & HLSProvider)
  | ({ type: 'youtube' } & YouTubeProvider)
  | ({ type: 'vimeo' } & VimeoProvider)
  | ({ type: 'google-cast' } & GoogleCastProvider);

export interface MediaProviderLoader<Provider extends MediaProviderAdapter = MediaProviderAdapter> {
  readonly name: string;
  target: HTMLElement | null;
  canPlay(src: Src): boolean;
  mediaType(src?: Src): MediaType;
  preconnect?(ctx: MediaContext): void;
  load(ctx: MediaContext): Promise<Provider>;
  loadPoster?(src: Src, ctx: MediaContext, abort: AbortController): Promise<string | null>;
}

export interface MediaProviderAdapter {
  readonly scope: Scope;
  readonly type: string;
  readonly currentSrc: Src | null;
  readonly audioGain?: AudioGainAdapter;
  readonly fullscreen?: MediaFullscreenAdapter;
  readonly pictureInPicture?: MediaPictureInPictureAdapter;
  readonly airPlay?: MediaRemotePlaybackAdapter;
  readonly canLiveSync?: boolean;
  preconnect?(): void;
  setup(): void;
  destroy?(): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  setMuted(muted: boolean): void;
  setCurrentTime(time: number): void;
  setVolume(volume: number): void;
  setPlaysInline?(inline: boolean): void;
  setPlaybackRate?(rate: number): void;
  loadSource(src: Src, preload: MediaState['preload']): Promise<void>;
}

export interface AudioGainAdapter {
  readonly supported: boolean;
  readonly currentGain: number | null;
  setGain(gain: number): void;
  removeGain(): void;
}

export interface MediaRemotePlaybackAdapter {
  /**
   * Whether requesting playback is supported.
   */
  readonly supported: boolean;
  /**
   * Request remote playback.
   */
  prompt(options?: unknown): Promise<void>;
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
