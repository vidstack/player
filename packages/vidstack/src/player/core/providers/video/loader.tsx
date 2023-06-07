import { computed } from 'maverick.js';
import { isString } from 'maverick.js/std';

import { isHLSSrc, VIDEO_EXTENSIONS, VIDEO_TYPES } from '../../../../utils/mime';
import { canPlayHLSNatively } from '../../../../utils/support';
import type { MediaContext } from '../../api/context';
import type { MediaStore } from '../../api/store';
import type { MediaSrc, MediaType } from '../../api/types';
import type { MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';

export class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
  _video!: HTMLVideoElement;

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

  async load(context: MediaContext) {
    if (__DEV__ && !this._video) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-outlet>`?',
      );
    }

    return new (await import('./provider')).VideoProvider(this._video, context);
  }

  render($store: MediaStore) {
    const $poster = computed(() => ($store.poster() && $store.controls() ? $store.poster() : null));

    if (__SERVER__) {
      const src = $store.source().src;
      return (
        <video
          src={isString(src) ? src : null}
          poster={$poster()}
          muted={$store.muted()}
          controls={$store.controls()}
          crossorigin={$store.crossorigin()}
          playsinline={$store.playsinline()}
          preload="none"
          aria-hidden="true"
        ></video>
      );
    }

    return (
      <video
        controls={$store.controls()}
        crossorigin={$store.crossorigin()}
        poster={$poster()}
        preload="none"
        aria-hidden="true"
        $ref={(el) => void (this._video = el)}
      ></video>
    );
  }
}
