import { isHLSSrc, VIDEO_EXTENSIONS } from '../../../../utils/mime';
import { IS_SAFARI } from '../../../../utils/support';
import type { MediaStore } from '../../store';
import type { MediaSrc, MediaType } from '../../types';
import type { MediaProviderContext, MediaProviderLoader } from '../types';
import type { VideoProvider } from './provider';

export class VideoProviderLoader implements MediaProviderLoader<VideoProvider> {
  _video!: HTMLVideoElement;

  canPlay(src: MediaSrc) {
    return VIDEO_EXTENSIONS.test(src.src) || (IS_SAFARI && isHLSSrc(src));
  }

  mediaType(): MediaType {
    return 'video';
  }

  async load(context: MediaProviderContext) {
    if (__DEV__ && !this._video) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<vds-media-outlet>`?',
      );
    }

    return new (await import('./provider')).VideoProvider(this._video, context);
  }

  render($store: MediaStore) {
    if (__SERVER__) {
      return (
        <video
          src={$store.source.src}
          poster={$store.poster}
          muted={$store.muted}
          controls={$store.controls}
          playsinline={$store.playsinline}
          preload="none"
        ></video>
      );
    }

    // === `true` because it's `null` to start with until we know if the poster can load.
    const poster = () => ($store.poster && $store.canLoadPoster === true ? $store.poster : null);
    return <video poster={poster()} preload="none" $ref={(el) => void (this._video = el)}></video>;
  }
}
