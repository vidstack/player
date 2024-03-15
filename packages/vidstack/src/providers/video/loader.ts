import { isString } from 'maverick.js/std';

import type { MediaType, Src } from '../../core';
import type { MediaContext } from '../../core/api/media-context';
import { isVideoSrc } from '../../utils/mime';
import { canPlayVideoType } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';

export class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
  readonly name: string = 'video';

  target!: HTMLVideoElement;

  canPlay(src: Src) {
    if (!isVideoSrc(src)) return false;
    // Let this pass through on the server, we can figure out which type to play client-side. The
    // important thing is that the correct provider is loaded.
    return (
      __SERVER__ ||
      !isString(src.src) ||
      src.type === '?' ||
      canPlayVideoType(this.target, src.type)
    );
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
