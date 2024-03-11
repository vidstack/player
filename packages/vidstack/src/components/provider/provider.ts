import { Component, method, onDispose, peek, signal, State, tick } from 'maverick.js';
import { animationFrameThrottle, isString, setStyle } from 'maverick.js/std';
import type { CaptionsFileFormat } from 'media-captions';

import type { Src, TextTrackInit } from '../../core';
import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import type { MediaProviderLoader } from '../../providers';
import { SourceSelection } from './source-select';
import { Tracks } from './tracks';

export interface MediaProviderProps {
  /** @internal */
  loaders: MediaProviderLoader[];
}

export interface MediaProviderState {
  loader: MediaProviderLoader | null;
}

/**
 * Used to render the current provider.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/provider}
 */
export class MediaProvider extends Component<MediaProviderProps, MediaProviderState> {
  static props: MediaProviderProps = {
    loaders: [],
  };

  static state = new State<MediaProviderState>({
    loader: null,
  });

  private _media!: MediaContext;
  private _sources!: SourceSelection;
  private _domSources = signal<Src[]>([]);
  private _domTracks = signal<TextTrackInit[]>([]);

  private _loader: MediaProviderLoader | null = null;

  protected override onSetup() {
    this._media = useMediaContext();
    this._sources = new SourceSelection(
      this._domSources,
      this._media,
      this.$state.loader,
      this.$props.loaders(),
    );
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-provider', '');
  }

  protected override onConnect(el: HTMLElement) {
    this._sources.connect();
    new Tracks(this._domTracks, this._media);

    const resize = new ResizeObserver(animationFrameThrottle(this._onResize.bind(this)));
    resize.observe(el);

    const mutations = new MutationObserver(this._onMutation.bind(this));
    mutations.observe(el, { attributes: true, childList: true });

    this._onResize();
    this._onMutation();

    onDispose(() => {
      resize.disconnect();
      mutations.disconnect();
    });
  }

  protected _loadRafId = -1;

  @method
  load(target: HTMLElement | null | undefined) {
    // Use a RAF here to prevent hot reloads resetting provider.
    window.cancelAnimationFrame(this._loadRafId);
    this._loadRafId = requestAnimationFrame(() => this._runLoader(target));
    onDispose(() => {
      window.cancelAnimationFrame(this._loadRafId);
    });
  }

  protected _runLoader(target: HTMLElement | null | undefined) {
    if (!this.scope) return;

    const loader = this.$state.loader(),
      { $provider } = this._media;

    if (this._loader === loader && loader?.target === target && peek($provider)) return;

    this._destroyProvider();
    this._loader = loader;
    if (loader) loader.target = target || null;

    if (!loader || !target) return;

    loader.load(this._media).then((provider) => {
      if (!this.scope) return;

      // The src/loader might've changed by the time we load the provider.
      if (peek(this.$state.loader) !== loader) return;

      this._media.delegate._notify('provider-change', provider);
    });
  }

  protected override onDestroy() {
    this._loader = null;
    this._destroyProvider();
  }

  private _destroyProvider() {
    this._media.delegate._notify('provider-change', null);
  }

  private _onResize() {
    if (!this.el) return;

    const { player, $state } = this._media,
      width = this.el.offsetWidth,
      height = this.el.offsetHeight;

    if (!player) return;

    $state.mediaWidth.set(width);
    $state.mediaHeight.set(height);

    if (player.el) {
      setStyle(player.el, '--media-width', width + 'px');
      setStyle(player.el, '--media-height', height + 'px');
    }
  }

  private _onMutation() {
    const sources: Src[] = [],
      tracks: TextTrackInit[] = [],
      children = this.el!.children;

    for (const el of children) {
      if (el.hasAttribute('data-vds')) continue;

      if (el instanceof HTMLSourceElement) {
        const src = {
          id: el.id,
          src: el.src,
          type: el.type,
        };

        // <source src="..." type="..." data-width="1920" data-height="1080" ... />
        for (const prop of ['id', 'src', 'width', 'height', 'bitrate', 'codec']) {
          const value = el.getAttribute(`data-${prop}`);
          if (isString(value)) src[prop] = /id|src|codec/.test(prop) ? value : Number(value);
        }

        sources.push(src);
      } else if (el instanceof HTMLTrackElement) {
        tracks.push({
          id: el.id,
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute('data-type') as CaptionsFileFormat,
        });
      }
    }

    this._domSources.set(sources);
    this._domTracks.set(tracks);
    tick();
  }
}
