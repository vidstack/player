import { Host } from 'maverick.js/element';

import { SeekButton } from '../../../components';

/**
 * @example
 * ```html
 * <!-- Forward +30s on each press. -->
 * <media-seek-button seconds="+30">
 *   <media-icon type="seek-forward"></media-icon>
 * </media-seek-button>
 * <!-- Backward -30s on each press. -->
 * <media-seek-button seconds="-30">
 *   <media-icon type="seek-backward"></media-icon>
 * </media-seek-button>
 * ```
 */
export class MediaSeekButtonElement extends Host(HTMLElement, SeekButton) {
  static tagName = 'media-seek-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-seek-button': MediaSeekButtonElement;
  }
}
