import type { Src } from '../../core/api/src-types';
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

    const target = this.target;

    if (__DEV__ && !target) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    const { HLSProvider } = await import('./provider');

    if (!target) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?',
      );
    }

    return new HLSProvider(target, context);
  }
}
