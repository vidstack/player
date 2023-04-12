import { computed, effect, peek, tick, type ReadSignal } from 'maverick.js';
import { isArray, isString } from 'maverick.js/std';

import { preconnect } from '../../../utils/network';
import type { MediaContext } from '../context';
import type { MediaControllerProps } from '../controller/types';
import { AudioProviderLoader } from '../providers/audio/loader';
import { HLSProviderLoader } from '../providers/hls/loader';
import type { MediaProviderLoader } from '../providers/types';
import { VideoProviderLoader } from '../providers/video/loader';
import type { MediaSrc } from '../types';

export function useSourceSelection(
  $domSources: ReadSignal<MediaSrc[]>,
  $rendered: ReadSignal<boolean>,
  context: MediaContext,
): void {
  const { $loader, $store: $media, $provider, delegate, $$props } = context;
  const { $src, $preferNativeHLS } = $$props;

  const HLS_LOADER = new HLSProviderLoader(),
    VIDEO_LOADER = new VideoProviderLoader(),
    AUDIO_LOADER = new AudioProviderLoader();

  const $loaders = computed<MediaProviderLoader[]>(() => {
    return $preferNativeHLS()
      ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER]
      : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER];
  });

  if (__SERVER__) {
    $media.sources = normalizeSrc($src());
    for (const src of $media.sources) {
      const loader = $loaders().find((loader) => loader.canPlay(src));
      if (loader) {
        $media.source = src;
        $media.mediaType = loader.mediaType(src);
        $loader.set(loader);
      }
    }
    return;
  }

  effect(() => {
    delegate.dispatch('sources-change', {
      detail: [...normalizeSrc($src()), ...$domSources()],
    });
  });

  effect(() => {
    // Read sources off store here because it's normalized above.
    const sources = $media.sources,
      currentSource = peek(() => $media.source);

    let newSource: MediaSrc = { src: '', type: '' },
      newLoader: MediaProviderLoader | null = null;

    for (const src of sources) {
      const loader = peek($loaders).find((loader) => loader.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
      }
    }

    if (newSource.src !== currentSource.src || newSource.type !== currentSource.type) {
      delegate.dispatch('source-change', { detail: newSource });
      delegate.dispatch('media-type-change', {
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

  effect(() => {
    const loader = $loader();
    if (!$rendered() || !loader) return;
    peek(() => {
      loader.load(context).then((provider) => {
        if (!peek($rendered)) return;
        // The src/loader might've changed by the time we load the provider.
        if (peek($loader) === loader) {
          context.delegate.dispatch('provider-change', {
            detail: provider,
          });
        }
      });
    });
  });

  effect(() => {
    const provider = $provider();
    if (!provider) return;
    if ($media.canLoad) {
      peek(() => provider.setup({ ...context, player: context.$player()! }));
      return;
    }
    peek(() => provider.preconnect?.(context));
  });

  effect(() => {
    const provider = $provider(),
      source = $media.source;

    if ($media.canLoad) {
      peek(() =>
        provider?.loadSource(
          source,
          peek(() => $media.preload),
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

function normalizeSrc(src: MediaControllerProps['src']): MediaSrc[] {
  return (isArray(src) ? src : [!isString(src) && 'src' in src ? src : { src }]).map(
    ({ src, type }) => ({
      src,
      type: type ?? (!isString(src) || src.startsWith('blob:') ? 'video/object' : '?'),
    }),
  );
}
