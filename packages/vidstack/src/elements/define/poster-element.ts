import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { Poster } from '../../components';
import { useMediaContext, type MediaContext } from '../../core/api/media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/poster}
 * @example
 * ```html
 * <media-player>
 *   <media-poster src="..." alt="Large alien ship hovering over New York."></media-poster>
 * </media-player>
 * ```
 */
export class MediaPosterElement extends Host(HTMLElement, Poster) {
  static tagName = 'media-poster';

  private _media!: MediaContext;
  private _img = document.createElement('img');

  protected onSetup(): void {
    this._media = useMediaContext();
    this.$state.img.set(this._img);
  }

  protected onConnect(): void {
    const { src, alt } = this.$state,
      { crossorigin } = this._media.$state;

    if (this._img.parentNode !== this) {
      this.prepend(this._img);
    }

    effect(() => {
      setAttribute(this._img, 'src', src());
      setAttribute(this._img, 'alt', alt());
      setAttribute(
        this._img,
        'crossorigin',
        /ytimg\.com|vimeo/.test(src() || '') ? null : crossorigin(),
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-poster': MediaPosterElement;
  }
}
