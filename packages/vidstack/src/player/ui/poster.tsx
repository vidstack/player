import { computed, effect, signal, type ReadSignal } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { $ariaBool } from '../../utils/aria';
import { preconnect } from '../../utils/network';
import { useMedia, type MediaContext } from '../core/api/context';

declare global {
  interface MaverickElements {
    'media-poster': MediaPosterElement;
  }
}

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected meaning the poster won't load until the media can.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/poster}
 * @example
 * ```html
 * <media-player poster="...">
 *   <media-poster alt="Large alien ship hovering over New York."></media-poster>
 * </media-player>
 * ```
 */
export class Poster extends Component<PosterAPI> {
  static el = defineElement<PosterAPI>({
    tagName: 'media-poster',
    props: { alt: undefined },
  });

  protected _media!: MediaContext;
  protected _imgLoading = signal(true);
  protected _imgError = signal(false);
  protected _imgSrc!: ReadSignal<string | null>;
  protected _imgAlt!: ReadSignal<string | null | undefined>;

  protected override onAttach(el: HTMLElement): void {
    this._media = useMedia();
    this._imgSrc = computed(this._getImgSrc.bind(this));
    this._imgAlt = this._getImgAlt.bind(this);
    this.setAttributes({
      'data-loading': this._imgLoading,
      'aria-hidden': $ariaBool(this._isHidden.bind(this)),
    });
  }

  protected override onConnect(el: HTMLElement) {
    const { canLoad, poster } = this._media.$store;

    window.requestAnimationFrame(() => {
      if (!canLoad()) preconnect(poster());
    });

    effect(this._onLoadStart.bind(this));
  }

  protected _isHidden() {
    const { poster } = this._media.$store;
    return this._imgError() || !poster();
  }

  protected _getImgSrc() {
    const { canLoad, poster } = this._media.$store;
    return canLoad() && poster().length ? poster() : null;
  }

  protected _getImgAlt() {
    return this._imgSrc() ? this.$props.alt() : null;
  }

  protected _onLoadStart() {
    const { canLoad, poster } = this._media.$store;
    const isLoading = canLoad() && !!poster();
    this._imgLoading.set(isLoading);
    this._imgError.set(false);
  }

  protected _onLoad() {
    this._imgLoading.set(false);
  }

  protected _onError() {
    this._imgLoading.set(false);
    this._imgError.set(true);
  }

  override render() {
    const { crossorigin } = this._media.$store;
    return (
      <img
        src={this._imgSrc()}
        alt={this._imgAlt()}
        crossorigin={crossorigin()}
        part="img"
        $on:load={this._onLoad.bind(this)}
        $on:error={this._onError.bind(this)}
      />
    );
  }
}

export interface PosterAPI {
  props: PosterProps;
}

export interface PosterProps {
  /**
   * ♿ **ARIA:** Provides alternative information for a poster image if a user for some reason
   * cannot view it.
   */
  alt: string | undefined;
}

export interface MediaPosterElement extends HTMLCustomElement<Poster> {}
