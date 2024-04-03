import { Component, effect, State } from 'maverick.js';
import { isNull, listenEvent, setAttribute } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import type { MediaCrossOrigin } from '../../core/api/types';
import { preconnect } from '../../utils/network';

export interface PosterProps {
  /**
   * The URL of the poster image resource.
   */
  src: string | null;
  /**
   * ♿ **ARIA:** Provides alternative information for a poster image if a user for some reason
   * cannot view it.
   */
  alt: string | null;
  /**
   * Defines how the img handles cross-origin requests, thereby enabling the
   * configuration of the CORS requests for the element's fetched data.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
   */
  crossOrigin: true | MediaCrossOrigin | null;
}

export interface PosterState {
  img: HTMLImageElement | null;
  src: string | null;
  alt: string | null;
  crossOrigin: MediaCrossOrigin | null;
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
    src: null,
    alt: null,
    crossOrigin: null,
  };

  static state = new State<PosterState>({
    img: null,
    src: null,
    alt: null,
    crossOrigin: null,
    loading: true,
    error: null,
    hidden: false,
  });

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._watchSrc();
    this._watchAlt();
    this._watchCrossOrigin();
    this._watchHidden();
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('pointer-events', 'none');

    effect(this._watchImg.bind(this));
    effect(this._watchSrc.bind(this));
    effect(this._watchAlt.bind(this));
    effect(this._watchCrossOrigin.bind(this));
    effect(this._watchHidden.bind(this));

    const { started } = this._media.$state;
    this.setAttributes({
      'data-visible': () => !started() && !this.$state.hidden(),
      'data-loading': this._isLoading.bind(this),
      'data-error': this._hasError.bind(this),
      'data-hidden': this.$state.hidden,
    });
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._onPreconnect.bind(this));
    effect(this._onLoadStart.bind(this));
  }

  private _hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }

  private _onPreconnect() {
    const { canLoadPoster, poster } = this._media.$state;
    if (!canLoadPoster() && poster()) preconnect(poster(), 'preconnect');
  }

  private _watchHidden() {
    const { src } = this.$props,
      { poster, nativeControls } = this._media.$state;
    this.el && setAttribute(this.el, 'display', nativeControls() ? 'none' : null);
    this.$state.hidden.set(this._hasError() || !(src() || poster()) || nativeControls());
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

  private _prevSrc = '';
  private _watchSrc() {
    const { poster: defaultPoster } = this._media.$props,
      { canLoadPoster, providedPoster, inferredPoster } = this._media.$state;

    // Either src set on this poster component, or defined on the player.
    const src = this.$props.src() || '',
      poster = src || defaultPoster() || inferredPoster();

    if (this._prevSrc === providedPoster()) {
      providedPoster.set(src);
    }

    this.$state.src.set(canLoadPoster() && poster.length ? poster : null);
    this._prevSrc = src;
  }

  private _watchAlt() {
    const { src } = this.$props,
      { alt } = this.$state,
      { poster } = this._media.$state;
    alt.set(src() || poster() ? this.$props.alt() : null);
  }

  private _watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props,
      { crossOrigin: crossOriginState } = this.$state,
      { crossOrigin: mediaCrossOrigin, poster: src } = this._media.$state,
      crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();

    crossOriginState.set(
      /ytimg\.com|vimeo/.test(src() || '')
        ? null
        : crossOrigin === true
          ? 'anonymous'
          : crossOrigin,
    );
  }

  private _onLoadStart() {
    const { loading, error } = this.$state,
      { canLoadPoster, poster } = this._media.$state;
    loading.set(canLoadPoster() && !!poster());
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
