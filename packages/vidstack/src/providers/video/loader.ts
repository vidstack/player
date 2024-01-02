import type { MediaSrc, MediaType } from '../../core';
import type { MediaContext } from '../../core/api/media-context';
import { isVideoSrc } from '../../utils/mime';
import type { MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';

export class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
  readonly name: string = 'video';

  target!: HTMLVideoElement;

  canPlay(src: MediaSrc) {
    return isVideoSrc(src);
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
