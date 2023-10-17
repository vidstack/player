import { Host } from 'maverick.js/element';

import { MenuItems } from '../../../components';

/**
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
export class MediaMenuItemsElement extends Host(HTMLElement, MenuItems) {
  static tagName = 'media-menu-items';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu-items': MediaMenuItemsElement;
  }
}
