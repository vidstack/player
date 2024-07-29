import {
  computed,
  effect,
  peek,
  scoped,
  tick,
  type ReadSignal,
  type WriteSignal,
} from 'maverick.js';
import { DOMEvent, isArray, isString, noop } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { MediaPlayerProps } from '../../core/api/player-props';
import { isVideoQualitySrc, type Src } from '../../core/api/src-types';
import { AudioProviderLoader } from '../../providers/audio/loader';
import { DASHProviderLoader } from '../../providers/dash/loader';
import { HLSProviderLoader } from '../../providers/hls/loader';
import type { MediaProviderLoader } from '../../providers/types';
import { VideoProviderLoader } from '../../providers/video/loader';
import { VimeoProviderLoader } from '../../providers/vimeo/loader';
import { YouTubeProviderLoader } from '../../providers/youtube/loader';
import {
  resolveStreamTypeFromDASHManifest,
  resolveStreamTypeFromHLSManifest,
} from '../../utils/manifest';
import { isDASHSrc, isHLSSrc } from '../../utils/mime';
import { getRequestCredentials, preconnect } from '../../utils/network';
import { isHLSSupported } from '../../utils/support';

let warned = __DEV__ ? new Set<any>() : undefined;

const sourceTypes = new Map<string, string>();

export class SourceSelection {
  #initialize = false;
  #loaders: ReadSignal<MediaProviderLoader[]>;
  #domSources: ReadSignal<Src[]>;
  #media: MediaContext;
  #loader: WriteSignal<MediaProviderLoader | null>;

  constructor(
    domSources: ReadSignal<Src[]>,
    media: MediaContext,
    loader: WriteSignal<MediaProviderLoader | null>,
    customLoaders: MediaProviderLoader[] = [],
  ) {
    this.#domSources = domSources;
    this.#media = media;
    this.#loader = loader;

    const DASH_LOADER = new DASHProviderLoader(),
      HLS_LOADER = new HLSProviderLoader(),
      VIDEO_LOADER = new VideoProviderLoader(),
      AUDIO_LOADER = new AudioProviderLoader(),
      YOUTUBE_LOADER = new YouTubeProviderLoader(),
      VIMEO_LOADER = new VimeoProviderLoader(),
      EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];

    this.#loaders = computed<MediaProviderLoader[]>(() => {
      const remoteLoader = media.$state.remotePlaybackLoader();

      const loaders = media.$props.preferNativeHLS()
        ? [VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders]
        : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, ...EMBED_LOADERS, ...customLoaders];

      return remoteLoader ? [remoteLoader, ...loaders] : loaders;
    });

    const { $state } = media;
    $state.sources.set(normalizeSrc(media.$props.src()));

    // Initialize.
    for (const src of $state.sources()) {
      const loader = this.#loaders().find((loader) => loader.canPlay(src));
      if (!loader) continue;

      const mediaType = loader.mediaType(src);
      media.$state.source.set(src);
      media.$state.mediaType.set(mediaType);
      media.$state.inferredViewType.set(mediaType);

      this.#loader.set(loader);
      this.#initialize = true;
      break;
    }
  }

  connect() {
    const loader = this.#loader();
    if (this.#initialize) {
      this.#notifySourceChange(this.#media.$state.source(), loader);
      this.#notifyLoaderChange(loader);
      this.#initialize = false;
    }

    effect(this.#onSourcesChange.bind(this));
    effect(this.#onSourceChange.bind(this));
    effect(this.#onSetup.bind(this));
    effect(this.#onLoadSource.bind(this));
    effect(this.#onLoadPoster.bind(this));
  }

  #onSourcesChange() {
    this.#media.notify('sources-change', [
      ...normalizeSrc(this.#media.$props.src()),
      ...this.#domSources(),
    ]);
  }

  #onSourceChange() {
    const { $state } = this.#media;

    // Read sources off store here because it's normalized above.
    const sources = $state.sources(),
      currentSource = peek($state.source),
      newSource = this.#findNewSource(currentSource, sources),
      noMatch = sources[0]?.src && !newSource.src && !newSource.type;

    if (__DEV__ && noMatch && !warned!.has(newSource.src) && !peek(this.#loader)) {
      const source = sources[0];
      console.warn(
        '[vidstack] could not find a loader for any of the given media sources,' +
          ' consider providing `type`:' +
          `\n\n--- HTML ---\n\n<media-provider>\n  <source src="${source.src}" type="video/mp4" />\n</media-provider>"` +
          `\n\n--- React ---\n\n<MediaPlayer src={{ src: "${source.src}", type: "video/mp4" }}>` +
          '\n\n---\n\nFalling back to fetching source headers...',
      );
      warned!.add(newSource.src);
    }

    if (noMatch) {
      const { crossOrigin } = $state,
        credentials = getRequestCredentials(crossOrigin()),
        abort = new AbortController();

      Promise.all(
        sources.map((source) =>
          isString(source.src) && source.type === '?'
            ? fetch(source.src, {
                method: 'HEAD',
                credentials,
                signal: abort.signal,
              })
                .then((res) => {
                  source.type = res.headers.get('content-type') || '??';
                  sourceTypes.set(source.src as string, source.type);
                  return source;
                })
                .catch(() => source)
            : source,
        ),
      ).then((sources) => {
        if (abort.signal.aborted) return;

        const newSource = this.#findNewSource(peek($state.source), sources);

        tick();

        if (!newSource.src) {
          this.#media.notify('error', {
            message: 'Failed to load resource.',
            code: 4,
          });
        }
      });

      return () => abort.abort();
    }

    tick();
  }

  #findNewSource(currentSource: Src, sources: Src[]) {
    let newSource: Src = { src: '', type: '' },
      newLoader: MediaProviderLoader | null = null,
      triggerEvent: DOMEvent = new DOMEvent('sources-change', { detail: { sources } }),
      loaders = this.#loaders(),
      { started, paused, currentTime, quality, savedState } = this.#media.$state;

    for (const src of sources) {
      const loader = loaders.find((loader) => loader.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
        break;
      }
    }

    if (isVideoQualitySrc(newSource)) {
      const currentQuality = quality(),
        sourceQuality = sources.find((s) => s.src === currentQuality?.src)!;

      if (peek(started)) {
        savedState.set({
          paused: peek(paused),
          currentTime: peek(currentTime),
        });
      } else {
        savedState.set(null);
      }

      if (sourceQuality) {
        newSource = sourceQuality;
        triggerEvent = new DOMEvent('quality-change', {
          detail: { quality: currentQuality },
        });
      }
    }

    if (!isSameSrc(currentSource, newSource)) {
      this.#notifySourceChange(newSource, newLoader, triggerEvent);
    }

    if (newLoader !== peek(this.#loader)) {
      this.#notifyLoaderChange(newLoader, triggerEvent);
    }

    return newSource;
  }

  #notifySourceChange(src: Src, loader: MediaProviderLoader | null, trigger?: Event) {
    this.#media.notify('source-change', src, trigger);
    this.#media.notify('media-type-change', loader?.mediaType(src) || 'unknown', trigger);
  }

  #notifyLoaderChange(loader: MediaProviderLoader | null, trigger?: Event) {
    this.#media.$providerSetup.set(false);
    this.#media.notify('provider-change', null, trigger);
    loader && peek(() => loader!.preconnect?.(this.#media));
    this.#loader.set(loader);
    this.#media.notify('provider-loader-change', loader, trigger);
  }

  #onSetup() {
    const provider = this.#media.$provider();

    if (!provider || peek(this.#media.$providerSetup)) return;

    if (this.#media.$state.canLoad()) {
      scoped(() => provider.setup(), provider.scope);
      this.#media.$providerSetup.set(true);
      return;
    }

    peek(() => provider.preconnect?.());
  }

  #onLoadSource() {
    if (!this.#media.$providerSetup()) return;

    const provider = this.#media.$provider(),
      source = this.#media.$state.source(),
      crossOrigin = peek(this.#media.$state.crossOrigin),
      preferNativeHLS = peek(this.#media.$props.preferNativeHLS);

    if (isSameSrc(provider?.currentSrc, source)) {
      return;
    }

    if (this.#media.$state.canLoad()) {
      const abort = new AbortController();

      if (isHLSSrc(source)) {
        // Determined using `HLSProvider` if `hls.js` supported.
        if (preferNativeHLS || !isHLSSupported()) {
          resolveStreamTypeFromHLSManifest(source.src as string, {
            credentials: getRequestCredentials(crossOrigin),
            signal: abort.signal,
          })
            .then((streamType) => {
              this.#media.notify('stream-type-change', streamType);
            })
            .catch(noop);
        }
      } else if (isDASHSrc(source)) {
        resolveStreamTypeFromDASHManifest(source.src as string, {
          credentials: getRequestCredentials(crossOrigin),
          signal: abort.signal,
        })
          .then((streamType) => {
            this.#media.notify('stream-type-change', streamType);
          })
          .catch(noop);
      } else {
        this.#media.notify('stream-type-change', 'on-demand');
      }

      peek(() => {
        const preload = peek(this.#media.$state.preload);
        return provider?.loadSource(source, preload).catch((error) => {
          if (__DEV__) {
            this.#media.logger
              ?.errorGroup('[vidstack] failed to load source')
              .labelledLog('Error', error)
              .labelledLog('Source', source)
              .labelledLog('Provider', provider)
              .labelledLog('Media Context', { ...this.#media })
              .dispatch();
          }
        });
      });

      return () => abort.abort();
    }

    try {
      isString(source.src) && preconnect(new URL(source.src).origin);
    } catch (error) {
      if (__DEV__) {
        this.#media.logger
          ?.infoGroup(`Failed to preconnect to source: ${source.src}`)
          .labelledLog('Error', error)
          .dispatch();
      }
    }
  }

  #onLoadPoster() {
    const loader = this.#loader(),
      { providedPoster, source, canLoadPoster } = this.#media.$state;

    if (!loader || !loader.loadPoster || !source() || !canLoadPoster() || providedPoster()) return;

    const abort = new AbortController(),
      trigger = new DOMEvent('source-change', { detail: source });

    loader
      .loadPoster(source(), this.#media, abort)
      .then((url) => {
        this.#media.notify('poster-change', url || '', trigger);
      })
      .catch(() => {
        this.#media.notify('poster-change', '', trigger);
      });

    return () => {
      abort.abort();
    };
  }
}

function normalizeSrc(src: MediaPlayerProps['src']): Src[] {
  return (isArray(src) ? src : [src]).map((src) => {
    if (isString(src)) {
      return { src, type: inferType(src) };
    } else {
      return { ...src, type: inferType(src.src, src.type) };
    }
  });
}

function inferType(src: unknown, type?: string) {
  if (isString(type) && type.length) {
    return type;
  } else if (isString(src) && sourceTypes.has(src)) {
    return sourceTypes.get(src)!;
  } else if (!type && isHLSSrc({ src, type: '' })) {
    return 'application/x-mpegurl';
  } else if (!type && isDASHSrc({ src, type: '' })) {
    return 'application/dash+xml';
  } else if (!isString(src) || src.startsWith('blob:')) {
    return 'video/object';
  } else if (src.includes('youtube') || src.includes('youtu.be')) {
    return 'video/youtube';
  } else if (
    src.includes('vimeo') &&
    !src.includes('progressive_redirect') &&
    !src.includes('.m3u8')
  ) {
    return 'video/vimeo';
  }

  return '?';
}

export function isSameSrc(a: Src | undefined | null, b: Src | undefined | null) {
  return a?.src === b?.src && a?.type === b?.type;
}
