import { Component, effect, State } from 'maverick.js';
import { EventsController, isNull, listenEvent, setAttribute } from 'maverick.js/std';

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

  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();
    this.#watchSrc();
    this.#watchAlt();
    this.#watchCrossOrigin();
    this.#watchHidden();
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('pointer-events', 'none');

    effect(this.#watchImg.bind(this));
    effect(this.#watchSrc.bind(this));
    effect(this.#watchAlt.bind(this));
    effect(this.#watchCrossOrigin.bind(this));
    effect(this.#watchHidden.bind(this));

    const { started } = this.#media.$state;
    this.setAttributes({
      'data-visible': () => !started() && !this.$state.hidden(),
      'data-loading': this.#isLoading.bind(this),
      'data-error': this.#hasError.bind(this),
      'data-hidden': this.$state.hidden,
    });
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#onPreconnect.bind(this));
    effect(this.#onLoadStart.bind(this));
  }

  #hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }

  #onPreconnect() {
    const { canLoadPoster, poster } = this.#media.$state;
    if (!canLoadPoster() && poster()) preconnect(poster(), 'preconnect');
  }

  #watchHidden() {
    const { src } = this.$props,
      { poster, nativeControls } = this.#media.$state;
    this.el && setAttribute(this.el, 'display', nativeControls() ? 'none' : null);
    this.$state.hidden.set(this.#hasError() || !(src() || poster()) || nativeControls());
  }

  #isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }

  #watchImg() {
    const img = this.$state.img();
    if (!img) return;

    new EventsController(img)
      .add('load', this.#onLoad.bind(this))
      .add('error', this.#onError.bind(this));

    if (img.complete) this.#onLoad();
  }

  #prevSrc = '';
  #watchSrc() {
    const { poster: defaultPoster } = this.#media.$props,
      { canLoadPoster, providedPoster, inferredPoster } = this.#media.$state;

    // Either src set on this poster component, or defined on the player.
    const src = this.$props.src() || '',
      poster = src || defaultPoster() || inferredPoster();

    if (this.#prevSrc === providedPoster()) {
      providedPoster.set(src);
    }

    this.$state.src.set(canLoadPoster() && poster.length ? poster : null);
    this.#prevSrc = src;
  }

  #watchAlt() {
    const { src } = this.$props,
      { alt } = this.$state,
      { poster } = this.#media.$state;
    alt.set(src() || poster() ? this.$props.alt() : null);
  }

  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props,
      { crossOrigin: crossOriginState } = this.$state,
      { crossOrigin: mediaCrossOrigin, poster: src } = this.#media.$state,
      crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();

    crossOriginState.set(
      /ytimg\.com|vimeo/.test(src() || '')
        ? null
        : crossOrigin === true
          ? 'anonymous'
          : crossOrigin,
    );
  }

  #onLoadStart() {
    const { loading, error } = this.$state,
      { canLoadPoster, poster } = this.#media.$state;
    loading.set(canLoadPoster() && !!poster());
    error.set(null);
  }

  #onLoad() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
  }

  #onError(event: ErrorEvent) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
}
