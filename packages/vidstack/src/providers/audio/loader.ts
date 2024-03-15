import { isString } from 'maverick.js/std';

import type { MediaType, Src } from '../../core';
import type { MediaContext } from '../../core/api/media-context';
import { isAudioSrc } from '../../utils/mime';
import { canPlayAudioType } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';

export class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
  readonly name = 'audio';

  target!: HTMLAudioElement;

  canPlay(src: Src) {
    if (!isAudioSrc(src)) return false;
    // Let this pass through on the server, we can figure out which type to play client-side. The
    // important thing is that the correct provider is loaded.
    return (
      __SERVER__ ||
      !isString(src.src) ||
      src.type === '?' ||
      canPlayAudioType(this.target, src.type)
    );
  }

  mediaType(): MediaType {
    return 'audio';
  }

  async load(ctx: MediaContext) {
    if (__SERVER__) {
      throw Error('[vidstack] can not load audio provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<audio>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    return new (await import('./provider')).AudioProvider(this.target, ctx);
  }
}
