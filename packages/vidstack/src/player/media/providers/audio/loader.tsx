import { AUDIO_EXTENSIONS } from '../../../../utils/mime';
import type { MediaStore } from '../../store';
import type { MediaType } from '../../types';
import type { MediaProviderLoader } from '../types';
import type { AudioProvider } from './provider';

export class AudioProviderLoader implements MediaProviderLoader<AudioProvider> {
  _audio!: HTMLAudioElement;

  canPlay({ src }) {
    return AUDIO_EXTENSIONS.test(src);
  }

  mediaType(): MediaType {
    return 'audio';
  }

  async load() {
    if (__DEV__ && !this._audio) {
      throw Error(
        '[vidstack] `<audio>` element was not found - did you forget to include `<vds-media-outlet>`?',
      );
    }

    return new (await import('./provider')).AudioProvider(this._audio);
  }

  render($store: MediaStore) {
    if (__SERVER__) {
      return (
        <audio
          src={$store.source.src}
          muted={$store.muted}
          controls={$store.controls}
          playsinline={$store.playsinline}
          preload="none"
        ></audio>
      );
    }

    return <audio preload="none" $ref={(el) => void (this._audio = el)}></audio>;
  }
}
