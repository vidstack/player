import { Host } from 'maverick.js/element';

import { MuteButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-mute-button>
 *   <media-icon type="mute" data-state="volume-muted"></media-icon>
 *   <media-icon type="volume-low" data-state="volume-low"></media-icon>
 *   <media-icon type="volume-high" data-state="volume-high"></media-icon>
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
