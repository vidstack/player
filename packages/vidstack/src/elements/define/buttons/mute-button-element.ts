import { Host } from 'maverick.js/element';

import { MuteButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-mute-button>
 *   <media-icon type="mute"></media-icon>
 *   <media-icon type="volume-low"></media-icon>
 *   <media-icon type="volume-high"></media-icon>
 * </media-mute-button>
 * ```
 */
export class MediaMuteButtonElement extends Host(HTMLElement, MuteButton) {
  static tagName = 'media-mute-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-mute-button': MediaMuteButtonElement;
  }
}
