import { isString } from 'maverick.js/std';

import type { MediaContext, MediaSrc, MediaType } from '../../core';
import type { MediaProviderLoader } from '../types';
import type { VimeoProvider } from './provider';

export class VimeoProviderLoader implements MediaProviderLoader<VimeoProvider> {
  target!: HTMLIFrameElement;

  canPlay(src: MediaSrc): boolean {
    return isString(src.src) && src.type === 'video/vimeo';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(ctx: MediaContext): Promise<VimeoProvider> {
    if (__SERVER__) {
      throw Error('[vidstack] can not load vimeo provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<iframe>` element was not found - did you forget to include media provider?',
      );
    }

    return new (await import('./provider')).VimeoProvider(this.target);
  }
}
