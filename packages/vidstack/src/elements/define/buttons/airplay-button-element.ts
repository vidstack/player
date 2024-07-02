import { Host } from 'maverick.js/element';

import { AirPlayButton } from '../../../components/ui/buttons/airplay-button';

/**
 * @example
 * ```html
 * <media-airplay-button>
 *   <media-icon type="airplay"></media-icon>
 * </media-airplay-button>
 * ```
 */
export class MediaAirPlayButtonElement extends Host(HTMLElement, AirPlayButton) {
  static tagName = 'media-airplay-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-airplay-button': MediaAirPlayButtonElement;
  }
}
