import { Host } from 'maverick.js/element';

import { FullscreenButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-fullscreen-button>
 *   <media-icon type="fullscreen" data-state="enter"></media-icon>
 *   <media-icon type="fullscreen-exit" data-state="exit"></media-icon>
 * </media-fullscreen-button>
 * ```
 */
export class MediaFullscreenButtonElement extends Host(HTMLElement, FullscreenButton) {
  static tagName = 'media-fullscreen-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-fullscreen-button': MediaFullscreenButtonElement;
  }
}
