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

  #img = document.createElement('img');

  protected onSetup(): void {
    this.$state.img.set(this.#img);
  }

  protected onConnect(): void {
    const { src, alt, crossOrigin } = this.$state;

    effect(() => {
      const { loading, hidden } = this.$state;
      this.#img.style.display = loading() || hidden() ? 'none' : '';
    });

    effect(() => {
      setAttribute(this.#img, 'alt', alt());
      setAttribute(this.#img, 'crossorigin', crossOrigin());
      setAttribute(this.#img, 'src', src());
    });

    if (this.#img.parentNode !== this) {
      this.prepend(this.#img);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-poster': MediaPosterElement;
  }
}
