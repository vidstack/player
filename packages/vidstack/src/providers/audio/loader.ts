import { isString } from 'maverick.js/std';

import type { MediaSrc, MediaType } from '../../core';
import { AUDIO_EXTENSIONS, AUDIO_TYPES } from '../../utils/mime';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';

export class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
  target!: HTMLAudioElement;

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
    if (__SERVER__) {
      throw Error('[vidstack] can not load audio provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<audio>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    return new (await import('./provider')).AudioProvider(this.target);
  }
}
