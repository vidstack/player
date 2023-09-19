import { Host } from 'maverick.js/element';

import { PlayButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-play-button>
 *   <media-icon type="play"></media-icon>
 *   <media-icon type="pause"></media-icon>
 *   <media-icon type="replay"></media-icon>
 * </media-play-button>
 * ```
 */
export class MediaPlayButtonElement extends Host(HTMLElement, PlayButton) {
  static tagName = 'media-play-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-play-button': MediaPlayButtonElement;
  }
}
