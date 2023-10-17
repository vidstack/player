import { Host } from 'maverick.js/element';

import { MenuItem } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-menu-items>
 *      <media-menu-item></media-menu-item>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaMenuItemElement extends Host(HTMLElement, MenuItem) {
  static tagName = 'media-menu-item';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu-item': MediaMenuItemElement;
  }
}
