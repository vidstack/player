import { Component, effect, State } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { preconnect } from '../../utils/network';

export interface PosterProps {
  /**
   * The URL of the poster image resource.
   */
  src: string | undefined;
  /**
   * ♿ **ARIA:** Provides alternative information for a poster image if a user for some reason
   * cannot view it.
   */
  alt: string | undefined;
}

export interface PosterState {
  img: HTMLImageElement | null;
  src: string | null;
  alt: string | null | undefined;
  loading: boolean;
  error: boolean;
}

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected meaning the poster won't load until the media can.
 *
 * @attr data-loading - Whether poster image is loading.
 * @attr data-hidden - Whether poster should be hidden (failed to load).
 * @docs {@link https://www.vidstack.io/docs/player/components/media/poster}
 */
export class Poster extends Component<PosterProps, PosterState> {
  static props: PosterProps = {
    src: undefined,
    alt: undefined,
  };

  static state = new State<PosterState>({
    img: null,
    src: null,
    alt: null,
    loading: true,
    error: false,
  });

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._watchImgSrc();
    this._watchImgAlt();
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.pointerEvents = 'none';

    effect(this._watchImg.bind(this));
    effect(this._watchImgSrc.bind(this));
    effect(this._watchImgAlt.bind(this));

    this.setAttributes({
      'data-loading': this.$state.loading,
      'data-hidden': this._isHidden.bind(this),
    });
  }

  protected override onConnect(el: HTMLElement) {
    const { canLoad, poster } = this._media.$state;

    window.requestAnimationFrame(() => {
      if (!canLoad()) preconnect(poster());
    });

    effect(this._onLoadStart.bind(this));
  }

  private _isHidden() {
    const { src } = this.$props,
      { poster } = this._media.$state;
    return this.$state.error() || !(src() || poster());
  }

  private _watchImg() {
    const img = this.$state.img();
    if (!img) return;
    listenEvent(img, 'load', this._onLoad.bind(this));
    listenEvent(img, 'error', this._onError.bind(this));
  }

  private _watchImgSrc() {
    const { src: _src } = this.$props,
      { src } = this.$state,
      { canLoad, poster } = this._media.$state;

    // Either src set on this poster component, or defined on the player.
    const _poster = _src() || poster();

    src.set(canLoad() && _poster.length ? _poster : null);
  }

  private _watchImgAlt() {
    const { src, alt } = this.$state;
    alt.set(src() ? this.$props.alt() : null);
  }

  private _onLoadStart() {
    const { loading, error } = this.$state,
      { canLoad, poster } = this._media.$state;
    const isLoading = canLoad() && !!poster();
    loading.set(isLoading);
    error.set(false);
  }

  private _onLoad() {
    const { loading } = this.$state;
    loading.set(false);
  }

  private _onError() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(true);
  }
}
