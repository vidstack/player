import { Host } from 'maverick.js/element';

import { PIPButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-pip-button>
 *   <media-icon type="picture-in-picture"></media-icon>
 *   <media-icon type="picture-in-picture-exit"></media-icon>
 * </media-pip-button>
 * ```
 */
export class MediaPIPButtonElement extends Host(HTMLElement, PIPButton) {
  static tagName = 'media-pip-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-pip-button': MediaPIPButtonElement;
  }
}
