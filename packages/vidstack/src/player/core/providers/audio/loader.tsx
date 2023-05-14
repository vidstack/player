import { isString } from 'maverick.js/std';

import { AUDIO_EXTENSIONS, AUDIO_TYPES } from '../../../../utils/mime';
import type { MediaStore } from '../../api/store';
import type { MediaSrc, MediaType } from '../../api/types';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';

export class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
  _audio!: HTMLAudioElement;

  canPlay({ src, type }: MediaSrc) {
    return isString(src)
      ? AUDIO_EXTENSIONS.test(src) ||
          AUDIO_TYPES.has(type) ||
          (src.startsWith('blob:') && type === 'audio/object')
      : type === 'audio/object';
  }

  mediaType(): MediaType {
    return 'audio';
  }

  async load() {
    if (__DEV__ && !this._audio) {
      throw Error(
        '[vidstack] `<audio>` element was not found - did you forget to include `<media-outlet>`?',
      );
    }

    return new (await import('./provider')).AudioProvider(this._audio);
  }

  render($store: MediaStore) {
    if (__SERVER__) {
      const src = $store.source().src;
      return (
        <audio
          src={isString(src) ? src : null}
          muted={$store.muted()}
          controls={$store.controls()}
          crossorigin={$store.crossorigin()}
          playsinline={$store.playsinline()}
          preload="none"
          aria-hidden="true"
        ></audio>
      );
    }

    return (
      <audio
        controls={$store.controls()}
        crossorigin={$store.crossorigin()}
        preload="none"
        aria-hidden="true"
        $ref={(el) => void (this._audio = el)}
      ></audio>
    );
  }
}
