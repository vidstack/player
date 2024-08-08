import { Component, method, onDispose, peek, signal, State, tick } from 'maverick.js';
import { animationFrameThrottle, isString, setStyle } from 'maverick.js/std';
import type { CaptionsFileFormat } from 'media-captions';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import type { Src } from '../../core/api/src-types';
import { TextTrack, type TextTrackInit } from '../../core/tracks/text/text-track';
import type { MediaProviderLoader } from '../../providers/types';
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

  #media!: MediaContext;
  #sources!: SourceSelection;
  #domSources = signal<Src[]>([]);
  #domTracks = signal<TextTrackInit[]>([]);

  #loader: MediaProviderLoader | null = null;

  protected override onSetup() {
    this.#media = useMediaContext();
    this.#sources = new SourceSelection(
      this.#domSources,
      this.#media,
      this.$state.loader,
      this.$props.loaders(),
    );
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-provider', '');
  }

  protected override onConnect(el: HTMLElement) {
    this.#sources.connect();
    new Tracks(this.#domTracks, this.#media);

    const resize = new ResizeObserver(animationFrameThrottle(this.#onResize.bind(this)));
    resize.observe(el);

    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributes: true, childList: true });

    this.#onResize();
    this.#onMutation();

    onDispose(() => {
      resize.disconnect();
      mutations.disconnect();
    });
  }

  #loadRafId = -1;

  @method
  load(target: HTMLElement | null | undefined) {
    // Hide underlying provider element from screen readers.
    target?.setAttribute('aria-hidden', 'true');

    // Use a RAF here to prevent hot reloads resetting provider.
    window.cancelAnimationFrame(this.#loadRafId);
    this.#loadRafId = requestAnimationFrame(() => this.#runLoader(target));
    onDispose(() => {
      window.cancelAnimationFrame(this.#loadRafId);
    });
  }

  #runLoader(target: HTMLElement | null | undefined) {
    if (!this.scope) return;

    const loader = this.$state.loader(),
      { $provider } = this.#media;

    if (this.#loader === loader && loader?.target === target && peek($provider)) return;

    this.#destroyProvider();
    this.#loader = loader;
    if (loader) loader.target = target || null;

    if (!loader || !target) return;

    loader.load(this.#media).then((provider) => {
      if (!this.scope) return;

      // The src/loader might've changed by the time we load the provider.
      if (peek(this.$state.loader) !== loader) return;

      this.#media.notify('provider-change', provider);
    });
  }

  protected override onDestroy() {
    this.#loader = null;
    this.#destroyProvider();
  }

  #destroyProvider() {
    this.#media?.notify('provider-change', null);
  }

  #onResize() {
    if (!this.el) return;

    const { player, $state } = this.#media,
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

  #onMutation() {
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
        const track = {
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute('data-type') as CaptionsFileFormat,
        };

        tracks.push({
          id: el.id || TextTrack.createId(track),
          ...track,
        });
      }
    }

    this.#domSources.set(sources);
    this.#domTracks.set(tracks);
    tick();
  }
}
