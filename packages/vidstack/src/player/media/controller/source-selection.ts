import { effect, peek, ReadSignal, tick } from 'maverick.js';
import { isArray, isString } from 'maverick.js/std';

import { preconnect } from '../../../utils/network';
import type { MediaPlayerProps } from '../../element/types';
import type { MediaContext } from '../context';
import { AudioProviderLoader } from '../providers/audio/loader';
import { HLSProviderLoader } from '../providers/hls/loader';
import type { MediaProviderLoader } from '../providers/types';
import { VideoProviderLoader } from '../providers/video/loader';
import type { MediaSrc } from '../types';

const PROVIDER_LOADERS: MediaProviderLoader[] = [
  new AudioProviderLoader(),
  new VideoProviderLoader(),
  new HLSProviderLoader(),
];

export function useSourceSelection(
  $src: ReadSignal<MediaPlayerProps['src']>,
  context: MediaContext,
): void {
  const { $loader, $store, delegate } = context;

  if (__SERVER__) {
    $store.sources = normalizeSrc($src());
    for (const src of $store.sources) {
      const loader = PROVIDER_LOADERS.find((loader) => loader.canPlay(src));
      if (loader) {
        $store.source = src;
        $store.media = loader.mediaType(src);
        $loader.set(loader);
      }
    }
    return;
  }

  effect(() => {
    delegate.dispatch('sources-change', { detail: normalizeSrc($src()) });
  });

  effect(() => {
    // Read sources off store here because it's normalized above.
    const sources = $store.sources,
      currentSource = peek(() => $store.source);

    let newSource: MediaSrc = { src: '', type: '' },
      newLoader: MediaProviderLoader | null = null;

    for (const src of sources) {
      const loader = PROVIDER_LOADERS.find((loader) => loader.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
      }
    }

    if (newSource.src !== currentSource.src || newSource.type !== currentSource.type) {
      delegate.dispatch('source-change', { detail: newSource });
      delegate.dispatch('media-change', {
        detail: newLoader?.mediaType(newSource) || 'unknown',
      });
    }

    if (newLoader !== peek($loader)) {
      delegate.dispatch('provider-change', { detail: null });
      newLoader && peek(() => newLoader!.preconnect?.(context));
      delegate.dispatch('provider-loader-change', { detail: newLoader });
    }

    tick();
  });

  // !!! The loader is attached inside the `<MediaOutlet>` because it requires rendering. !!!

  effect(() => {
    const provider = context.$provider();
    if (!provider) return;
    if (context.$store.canLoad) {
      peek(() => provider.setup({ ...context, player: context.$player()! }));
      context.delegate.dispatch('provider-setup', { detail: provider });
      return;
    }
    peek(() => provider.preconnect?.(context));
  });

  effect(() => {
    const provider = context.$provider(),
      source = context.$store.source;

    if (context.$store.canLoad) {
      peek(() =>
        provider?.loadSource(
          source,
          peek(() => context.$store.preload),
        ),
      );
      return;
    }

    try {
      isString(source.src) && preconnect(new URL(source.src).origin, 'preconnect');
    } catch (e) {
      if (__DEV__) {
        context.logger
          ?.infoGroup(`Failed to preconnect to source: ${source.src}`)
          .labelledLog('Error', e)
          .dispatch();
      }
    }
  });
}

function normalizeSrc(src: MediaPlayerProps['src']) {
  return (isArray(src) ? src : [{ src }]).map(({ src, type }) => ({
    src,
    type: type ?? (!isString(src) ? 'video/object' : '?'),
  }));
}
