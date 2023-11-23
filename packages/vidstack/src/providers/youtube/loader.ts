import { isString } from 'maverick.js/std';

import type { MediaContext, MediaSrc, MediaType } from '../../core';
import type { MediaProviderLoader } from '../types';
import { YouTubeProvider } from './provider';

export class YouTubeProviderLoader implements MediaProviderLoader<YouTubeProvider> {
  target!: HTMLIFrameElement;

  canPlay(src: MediaSrc): boolean {
    return isString(src.src) && src.type === 'video/youtube';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(ctx: MediaContext): Promise<YouTubeProvider> {
    if (__SERVER__) {
      throw Error('[vidstack] can not load youtube provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<iframe>` element was not found - did you forget to include media provider?',
      );
    }

    return new (await import('./provider')).YouTubeProvider(this.target);
  }
}
