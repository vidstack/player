import type { JSX, ReadSignal } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type { FullscreenAdapter } from '../../../foundation/fullscreen/fullscreen';
import type { Logger } from '../../../foundation/logger/create-logger';
import type { MediaElement } from '../../element/types';
import type { MediaControllerDelegate } from '../controller/controller-delegate';
import type { MediaState } from '../state';
import type { MediaStore } from '../store';
import type { MediaSrc, MediaType } from '../types';

export interface MediaProviderElement extends HTMLCustomElement {}

export interface MediaProviderLoader<Provider extends MediaProvider = MediaProvider> {
  canPlay(src: MediaSrc): boolean;
  mediaType(src: MediaSrc): MediaType;
  preconnect?(context: MediaProviderContext): void;
  load(context: MediaProviderContext): Promise<Provider>;
  render($store: MediaStore): JSX.Element;
}

export interface MediaProvider
  extends Pick<MediaState, 'paused' | 'muted' | 'currentTime' | 'volume' | 'playsinline'> {
  readonly fullscreen?: MediaFullscreenAdapter;
  preconnect?(context: MediaProviderContext): void;
  setup(context: MediaProviderContext): void;
  destroy?(): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  loadSource(src: MediaSrc, preload: MediaState['preload']): Promise<void>;
}

export interface MediaProviderContext {
  logger?: Logger;
  player: MediaElement;
  delegate: MediaControllerDelegate;
  $player: ReadSignal<MediaElement | null>;
  $store: MediaStore;
}

export interface MediaFullscreenAdapter extends FullscreenAdapter {}
