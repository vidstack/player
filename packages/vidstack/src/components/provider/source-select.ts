import { computed, effect, peek, tick, type ReadSignal, type WriteSignal } from 'maverick.js';
import { isArray, isString } from 'maverick.js/std';

import type { MediaContext, MediaPlayerProps, MediaSrc } from '../../core';
import {
  AudioProviderLoader,
  HLSProviderLoader,
  VideoProviderLoader,
  type MediaProviderLoader,
} from '../../providers';
import { getRequestCredentials, preconnect } from '../../utils/network';

let warned = __DEV__ ? new Set<any>() : undefined;

export class SourceSelection {
  private _initialize = false;
  private _loaders: ReadSignal<MediaProviderLoader[]>;

  constructor(
    private _domSources: ReadSignal<MediaSrc[]>,
    private _media: MediaContext,
    private _loader: WriteSignal<MediaProviderLoader | null>,
  ) {
    const HLS_LOADER = new HLSProviderLoader(),
      VIDEO_LOADER = new VideoProviderLoader(),
      AUDIO_LOADER = new AudioProviderLoader();

    this._loaders = computed<MediaProviderLoader[]>(() => {
      return _media.$props.preferNativeHLS()
        ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER]
        : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER];
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
    effect(this._onConnect.bind(this));
    effect(this._onLoadSource.bind(this));
  }

  private _onSourcesChange() {
    this._media.delegate._dispatch('sources-change', {
      detail: [...normalizeSrc(this._media.$props.src()), ...this._domSources()],
    });
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
          `\n\n<media-provider>\n  <source src="${source.src}" type="video/mp4" />\n</media-provider>"` +
          '\n\nFalling back to fetching source headers...',
      );
      warned!.add(newSource.src);
    }

    if (noMatch) {
      const { crossorigin } = $state,
        credentials = getRequestCredentials(crossorigin()),
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

  protected _findNewSource(currentSource: MediaSrc, sources: MediaSrc[]) {
    let newSource: MediaSrc = { src: '', type: '' },
      newLoader: MediaProviderLoader | null = null;

    for (const src of sources) {
      const loader = peek(this._loaders).find((loader) => loader.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
      }
    }

    if (newSource.src !== currentSource.src || newSource.type !== currentSource.type) {
      this._notifySourceChange(newSource, newLoader);
    }

    if (newLoader !== peek(this._loader)) {
      this._notifyLoaderChange(newLoader);
    }

    return newSource;
  }

  protected _notifySourceChange(src: MediaSrc, loader: MediaProviderLoader | null) {
    this._media.delegate._dispatch('source-change', { detail: src });
    this._media.delegate._dispatch('media-type-change', {
      detail: loader?.mediaType(src) || 'unknown',
    });
  }

  protected _notifyLoaderChange(loader: MediaProviderLoader | null) {
    this._media.delegate._dispatch('provider-change', { detail: null });
    loader && peek(() => loader!.preconnect?.(this._media));
    this._loader.set(loader);
    this._media.delegate._dispatch('provider-loader-change', { detail: loader });
  }

  private _onConnect() {
    const provider = this._media.$provider();
    if (!provider) return;

    if (this._media.$state.canLoad()) {
      peek(() => provider.setup(this._media));
      return;
    }

    peek(() => provider.preconnect?.(this._media));
  }

  private _onLoadSource() {
    const provider = this._media.$provider(),
      source = this._media.$state.source();

    if (this._media.$state.canLoad()) {
      peek(() => provider?.loadSource(source, peek(this._media.$state.preload)));
      return;
    }

    try {
      isString(source.src) && preconnect(new URL(source.src).origin, 'preconnect');
    } catch (error) {
      if (__DEV__) {
        this._media.logger
          ?.infoGroup(`Failed to preconnect to source: ${source.src}`)
          .labelledLog('Error', error)
          .dispatch();
      }
    }
  }
}

function normalizeSrc(src: MediaPlayerProps['src']): MediaSrc[] {
  return (isArray(src) ? src : [!isString(src) && 'src' in src ? src : { src }]).map(
    ({ src, type }) => ({
      src,
      type: type ?? (!isString(src) || src.startsWith('blob:') ? 'video/object' : '?'),
    }),
  );
}
