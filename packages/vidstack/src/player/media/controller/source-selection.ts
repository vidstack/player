import { effect, peek, ReadSignal, tick } from 'maverick.js';
import { isArray, isString } from 'maverick.js/std';

import type { MediaPlayerProps } from '../../element/types';
import type { MediaContext } from '../context';
import { AudioProviderLoader } from '../providers/audio/loader';
import { HLSProviderLoader } from '../providers/hls/loader';
import type { MediaProviderLoader } from '../providers/types';
import { VideoProviderLoader } from '../providers/video/loader';

const PROVIDER_LOADERS: MediaProviderLoader[] = [
  new AudioProviderLoader(),
  new VideoProviderLoader(),
  new HLSProviderLoader(),
];

export function useSourceSelection(
  $src: ReadSignal<MediaPlayerProps['src']>,
  { $loader, $store, delegate, logger }: MediaContext,
): void {
  if (__SERVER__) {
    $store.sources = normalizeSrc($src());
    for (const src of $store.sources) {
      const loader = PROVIDER_LOADERS.find((loader) => loader.canPlay(src));
      if (loader) {
        $store.source = src;
        $loader.set(loader);
      }
    }
  }

  effect(() => {
    delegate.dispatch('sources-change', { detail: normalizeSrc($src()) });
  });

  effect(() => {
    // Read sources off store here because it's normalized above.
    const sources = $store.sources,
      source = peek(() => $store.source);

    for (const src of sources) {
      const loader = PROVIDER_LOADERS.find((loader) => loader.canPlay(src));
      if (loader) {
        if (src.src !== source.src) {
          if (__DEV__) {
            logger
              ?.infoGroup('📼 Media source change')
              .labelledLog('Sources', sources)
              .labelledLog('Current Src', src)
              .labelledLog('Provider Loader', loader)
              .dispatch();
          }

          delegate.dispatch('source-change', { detail: src });
          delegate.dispatch('media-change', { detail: loader.mediaType(src) });
          tick();
        }

        $loader.set(loader);
        return;
      }
    }

    $loader.set(null);
  });

  // The rest of the loading process is handled inside `<media-outlet>`.
}

function normalizeSrc(src: MediaPlayerProps['src']) {
  return (isArray(src) ? src : [{ src }]).map(({ src, type }) => ({
    src,
    type: type ?? (!isString(src) ? 'video/stream' : '?'),
  }));
}
