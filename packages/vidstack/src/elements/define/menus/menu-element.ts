import { Host } from 'maverick.js/element';

import { Menu } from '../../../components';

/**
 * @part close-target - Closes menu when pressed.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-menu-button aria-label="Settings">
 *     <media-icon type="settings"></media-icon>
 *   </media-menu-button>
 *   <media-menu-items>
 *     <!-- ... -->
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaMenuElement extends Host(HTMLElement, Menu) {
  static tagName = 'media-menu';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu': MediaMenuElement;
  }
}
