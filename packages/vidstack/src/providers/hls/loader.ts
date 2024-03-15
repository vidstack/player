import type { Src } from '../../core';
import { isHLSSrc } from '../../utils/mime';
import { isHLSSupported } from '../../utils/support';
import type { MediaProviderLoader } from '../types';
import { VideoProviderLoader } from '../video/loader';
import type { HLSProvider } from './provider';

export class HLSProviderLoader
  extends VideoProviderLoader
  implements MediaProviderLoader<HLSProvider>
{
  static supported = isHLSSupported();

  override readonly name = 'hls';

  override canPlay(src: Src) {
    return HLSProviderLoader.supported && isHLSSrc(src);
  }

  override async load(context) {
    if (__SERVER__) {
      throw Error('[vidstack] can not load hls provider server-side');
    }

    if (__DEV__ && !this.target) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    return new (await import('./provider')).HLSProvider(this.target, context);
  }
}
