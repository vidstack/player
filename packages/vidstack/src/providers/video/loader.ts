import { isString } from 'maverick.js/std';

import type { MediaContext, MediaSrc, MediaType } from '../../core';
import { isHLSSrc, VIDEO_EXTENSIONS, VIDEO_TYPES } from '../../utils/mime';
import { canPlayHLSNatively } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';

export class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
  target!: HTMLVideoElement;

  canPlay(src: MediaSrc) {
    return isString(src.src)
      ? VIDEO_EXTENSIONS.test(src.src) ||
          VIDEO_TYPES.has(src.type) ||
          (src.src.startsWith('blob:') && src.type === 'video/object') ||
          (isHLSSrc(src) && (__SERVER__ || canPlayHLSNatively()))
      : src.type === 'video/object';
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(ctx: MediaContext) {
    if (__SERVER__) {
      throw Error('[vidstack] can not load video provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include media provider?',
      );
    }

    return new (await import('./provider')).VideoProvider(this.target, ctx);
  }
}
