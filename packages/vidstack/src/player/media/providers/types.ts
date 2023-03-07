import type { JSX } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type { FullscreenAdapter } from '../../../foundation/fullscreen/fullscreen';
import type { MediaPlayerElement } from '../../element/types';
import type { MediaContext } from '../context';
import type { MediaState } from '../state';
import type { MediaStore } from '../store';
import type { MediaSrc, MediaType } from '../types';

export interface MediaProviderElement extends HTMLCustomElement {}

export interface MediaProviderLoader<Provider extends MediaProvider = MediaProvider> {
  canPlay(src: MediaSrc): boolean;
  mediaType(src: MediaSrc): MediaType;
  preconnect?(context: MediaContext): void;
  load(context: MediaContext): Promise<Provider>;
  render($store: MediaStore): JSX.Element;
}

export interface MediaProvider
  extends Pick<
    MediaState,
    'paused' | 'muted' | 'currentTime' | 'volume' | 'playsinline' | 'playbackRate'
  > {
  readonly type: string;
  readonly fullscreen?: MediaFullscreenAdapter;
  readonly canLiveSync?: boolean;
  preconnect?(context: MediaContext): void;
  setup(context: MediaSetupContext): void;
  destroy?(): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  loadSource(src: MediaSrc, preload: MediaState['preload']): Promise<void>;
}

export interface MediaSetupContext extends MediaContext {
  player: MediaPlayerElement;
}

export interface MediaFullscreenAdapter extends FullscreenAdapter {}
