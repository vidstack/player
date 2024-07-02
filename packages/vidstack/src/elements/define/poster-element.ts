import { effect } from 'maverick.js';
import { Host, type Attributes } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { Poster, type PosterProps } from '../../components/ui/poster';

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

  static override attrs: Attributes<PosterProps> = {
    crossOrigin: 'crossorigin',
  };

  private _img = document.createElement('img');

  protected onSetup(): void {
    this.$state.img.set(this._img);
  }

  protected onConnect(): void {
    const { src, alt, crossOrigin } = this.$state;

    effect(() => {
      const { loading, hidden } = this.$state;
      this._img.style.display = loading() || hidden() ? 'none' : '';
    });

    effect(() => {
      setAttribute(this._img, 'alt', alt());
      setAttribute(this._img, 'crossorigin', crossOrigin());
      setAttribute(this._img, 'src', src());
    });

    if (this._img.parentNode !== this) {
      this.prepend(this._img);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-poster': MediaPosterElement;
  }
}
