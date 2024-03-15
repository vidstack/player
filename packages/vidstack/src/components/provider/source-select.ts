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

import { isVideoQualitySrc, type MediaContext, type MediaPlayerProps, type Src } from '../../core';
import {
  AudioProviderLoader,
  HLSProviderLoader,
  VideoProviderLoader,
  VimeoProviderLoader,
  YouTubeProviderLoader,
  type MediaProviderLoader,
} from '../../providers';
import { resolveStreamTypeFromHLSManifest } from '../../utils/hls';
import { isHLSSrc } from '../../utils/mime';
import { getRequestCredentials, preconnect } from '../../utils/network';
import { isHLSSupported } from '../../utils/support';

let warned = __DEV__ ? new Set<any>() : undefined;

const sourceTypes = new Map<string, string>();

export class SourceSelection {
  private _initialize = false;
  private _loaders: ReadSignal<MediaProviderLoader[]>;

  private get _notify() {
    return this._media.delegate._notify;
  }

  constructor(
    private _domSources: ReadSignal<Src[]>,
    private _media: MediaContext,
    private _loader: WriteSignal<MediaProviderLoader | null>,
    customLoaders: MediaProviderLoader[] = [],
  ) {
    const HLS_LOADER = new HLSProviderLoader(),
      VIDEO_LOADER = new VideoProviderLoader(),
      AUDIO_LOADER = new AudioProviderLoader(),
      YOUTUBE_LOADER = new YouTubeProviderLoader(),
      VIMEO_LOADER = new VimeoProviderLoader(),
      EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];

    this._loaders = computed<MediaProviderLoader[]>(() => {
      const remoteLoader = _media.$state.remotePlaybackLoader();

      const loaders = _media.$props.preferNativeHLS()
        ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders]
        : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, ...EMBED_LOADERS, ...customLoaders];

      return remoteLoader ? [remoteLoader, ...loaders] : loaders;
    });

    const { $state } = _media;
    $state.sources.set(normalizeSrc(_media.$props.src()));

    // Initialize.
    for (const src of $state.sources()) {
      const loader = this._loaders().find((loader) => loader.canPlay(src));
      if (!loader) continue;

      const mediaType = loader.mediaType(src);
      this._media.$state.source.set(src);
      this._media.$state.mediaType.set(mediaType);
      this._media.$state.inferredViewType.set(mediaType);

      this._loader.set(loader);
      this._initialize = true;
    }
  }

  connect() {
    const loader = this._loader();
    if (this._initialize) {
      this._notifySourceChange(this._media.$state.source(), loader);
      this._notifyLoaderChange(loader);
      this._initialize = false;
    }

    effect(this._onSourcesChange.bind(this));
    effect(this._onSourceChange.bind(this));
    effect(this._onSetup.bind(this));
    effect(this._onLoadSource.bind(this));
    effect(this._onLoadPoster.bind(this));
  }

  private _onSourcesChange() {
    this._notify('sources-change', [
      ...normalizeSrc(this._media.$props.src()),
      ...this._domSources(),
    ]);
  }

  private _onSourceChange() {
    const { $state } = this._media;

    // Read sources off store here because it's normalized above.
    const sources = $state.sources(),
      currentSource = peek($state.source),
      newSource = this._findNewSource(currentSource, sources),
      noMatch = sources[0]?.src && !newSource.src && !newSource.type;

    if (__DEV__ && noMatch && !warned!.has(newSource.src) && !peek(this._loader)) {
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
        this._findNewSource(peek($state.source), sources);
        tick();
      });

      return () => abort.abort();
    }

    tick();
  }

  protected _findNewSource(currentSource: Src, sources: Src[]) {
    let newSource: Src = { src: '', type: '' },
      newLoader: MediaProviderLoader | null = null,
      triggerEvent: DOMEvent = new DOMEvent('sources-change', { detail: { sources } }),
      loaders = this._loaders(),
      { started, paused, currentTime, quality, savedState } = this._media.$state;

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
      this._notifySourceChange(newSource, newLoader, triggerEvent);
    }

    if (newLoader !== peek(this._loader)) {
      this._notifyLoaderChange(newLoader, triggerEvent);
    }

    return newSource;
  }

  protected _notifySourceChange(src: Src, loader: MediaProviderLoader | null, trigger?: Event) {
    this._notify('source-change', src, trigger);
    this._notify('media-type-change', loader?.mediaType(src) || 'unknown', trigger);
  }

  protected _notifyLoaderChange(loader: MediaProviderLoader | null, trigger?: Event) {
    this._media.$providerSetup.set(false);
    this._notify('provider-change', null, trigger);
    loader && peek(() => loader!.preconnect?.(this._media));
    this._loader.set(loader);
    this._notify('provider-loader-change', loader, trigger);
  }

  private _onSetup() {
    const provider = this._media.$provider();

    if (!provider || peek(this._media.$providerSetup)) return;

    if (this._media.$state.canLoad()) {
      scoped(() => provider.setup(), provider.scope);
      this._media.$providerSetup.set(true);
      return;
    }

    peek(() => provider.preconnect?.());
  }

  private _onLoadSource() {
    if (!this._media.$providerSetup()) return;

    const provider = this._media.$provider(),
      source = this._media.$state.source(),
      crossOrigin = peek(this._media.$state.crossOrigin),
      preferNativeHLS = peek(this._media.$props.preferNativeHLS);

    if (isSameSrc(provider?.currentSrc, source)) {
      return;
    }

    if (this._media.$state.canLoad()) {
      const abort = new AbortController();

      if (isHLSSrc(source)) {
        // Determined using `HLSProvider` if `hls.js` supported.
        if (preferNativeHLS || !isHLSSupported()) {
          resolveStreamTypeFromHLSManifest(source.src as string, {
            credentials: getRequestCredentials(crossOrigin),
            signal: abort.signal,
          })
            .then((streamType) => {
              this._notify('stream-type-change', streamType);
            })
            .catch(noop);
        }
      } else {
        this._notify('stream-type-change', 'on-demand');
      }

      peek(() => {
        const preload = peek(this._media.$state.preload);
        return provider?.loadSource(source, preload).catch((error) => {
          if (__DEV__) {
            this._media.logger
              ?.errorGroup('[vidstack] failed to load source')
              .labelledLog('Error', error)
              .labelledLog('Source', source)
              .labelledLog('Provider', provider)
              .labelledLog('Media Context', { ...this._media })
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
        this._media.logger
          ?.infoGroup(`Failed to preconnect to source: ${source.src}`)
          .labelledLog('Error', error)
          .dispatch();
      }
    }
  }

  private _onLoadPoster() {
    const loader = this._loader(),
      { providedPoster, source, canLoadPoster } = this._media.$state;

    if (!loader || !loader.loadPoster || !source() || !canLoadPoster() || providedPoster()) return;

    const abort = new AbortController(),
      trigger = new DOMEvent('source-change', { detail: source });

    loader
      .loadPoster(source(), this._media, abort)
      .then((url) => {
        this._notify('poster-change', url || '', trigger);
      })
      .catch(() => {
        this._notify('poster-change', '', trigger);
      });

    return () => {
      abort.abort();
    };
  }
}

function normalizeSrc(src: MediaPlayerProps['src']): Src[] {
  return (isArray(src) ? src : [src])
    .map((src) => {
      if (isString(src)) {
        return {
          src,
          type: '?',
        };
      } else {
        return {
          ...src,
          type: inferType(src.src, src.type),
        };
      }
    })
    .sort((a) => (a.type === '?' ? 1 : -1));
}

function inferType(src: unknown, type?: string) {
  if (isString(type) && type.length) {
    return type;
  } else if (isString(src) && sourceTypes.has(src)) {
    return sourceTypes.get(src)!;
  } else if (!isString(src) || src.startsWith('blob:')) {
    return 'video/object';
  } else if (src.includes('youtube')) {
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
