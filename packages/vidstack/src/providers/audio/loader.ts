import type { MediaSrc, MediaType } from '../../core';
import { isAudioSrc } from '../../utils/mime';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';

export class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
  readonly name = 'audio';

  target!: HTMLAudioElement;

  canPlay(src: MediaSrc) {
    return isAudioSrc(src);
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
