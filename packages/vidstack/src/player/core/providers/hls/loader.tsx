import { isString } from 'maverick.js/std';

import { HLS_VIDEO_EXTENSIONS, HLS_VIDEO_TYPES } from '../../../../utils/mime';
import { preconnect } from '../../../../utils/network';
import { isHLSSupported } from '../../../../utils/support';
import type { MediaSrc } from '../../api/types';
import type { MediaProviderLoader } from '../types';
import { VideoProviderLoader } from '../video/loader';
import type { HLSProvider } from './provider';

export class HLSProviderLoader
  extends VideoProviderLoader
  implements MediaProviderLoader<HLSProvider>
{
  static supported = isHLSSupported();

  preconnect() {
    preconnect('https://cdn.jsdelivr.net', 'preconnect');
  }

  override canPlay({ src, type }: MediaSrc) {
    return (
      HLSProviderLoader.supported &&
      isString(src) &&
      (HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type))
    );
  }

  override async load(context) {
    if (__DEV__ && !this._video) {
      throw Error(
        '[vidstack] `<video>` element was not found - did you forget to include `<media-outlet>`?',
      );
    }

    return new (await import('./provider')).HLSProvider(this._video, context);
  }
}
