import { Component, effect, State } from 'maverick.js';
import { isNull, listenEvent, setAttribute } from 'maverick.js/std';

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
  error: ErrorEvent | null;
  hidden: boolean;
}

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected meaning the poster won't load until the media can.
 *
 * @attr data-visible - Whether poster image should be shown.
 * @attr data-loading - Whether poster image is loading.
 * @attr data-error - Whether an error occurred loading poster.
 * @attr data-hidden - Whether poster has no src or has failed to load.
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
    error: null,
    hidden: false,
  });

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._watchImgSrc();
    this._watchImgAlt();
    this._watchHidden();
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('pointer-events', 'none');

    effect(this._watchImg.bind(this));
    effect(this._watchImgSrc.bind(this));
    effect(this._watchImgAlt.bind(this));
    effect(this._watchHidden.bind(this));

    const { started } = this._media.$state;
    this.setAttributes({
      'data-visible': () => !started(),
      'data-loading': this._isLoading.bind(this),
      'data-error': this._hasError.bind(this),
      'data-hidden': this.$state.hidden,
    });
  }

  protected override onConnect(el: HTMLElement) {
    const { canLoad, poster } = this._media.$state;

    window.requestAnimationFrame(() => {
      if (!canLoad()) preconnect(poster());
    });

    effect(this._onLoadStart.bind(this));
  }

  private _hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }

  private _watchHidden() {
    const { src } = this.$props,
      { $iosControls } = this._media,
      { poster } = this._media.$state;

    this.el && setAttribute(this.el, 'display', $iosControls() ? 'none' : null);
    this.$state.hidden.set(this._hasError() || !(src() || poster()) || $iosControls());
  }

  private _isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }

  private _watchImg() {
    const img = this.$state.img();
    if (!img) return;
    listenEvent(img, 'load', this._onLoad.bind(this));
    listenEvent(img, 'error', this._onError.bind(this));
  }

  private _watchImgSrc() {
    const { canLoad, poster: defaultPoster } = this._media.$state;

    // Either src set on this poster component, or defined on the player.
    const src = this.$props.src(),
      poster = src || defaultPoster();

    if (src && defaultPoster() !== src) {
      this._media.$state.providedPoster.set(src);
    }

    this.$state.src.set(canLoad() && poster.length ? poster : null);
  }

  private _watchImgAlt() {
    const { src, alt } = this.$state;
    alt.set(src() ? this.$props.alt() : null);
  }

  private _onLoadStart() {
    const { loading, error } = this.$state,
      { canLoad, poster } = this._media.$state;
    loading.set(canLoad() && !!poster());
    error.set(null);
  }

  private _onLoad() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
  }

  private _onError(event: ErrorEvent) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
}
