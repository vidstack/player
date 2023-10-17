import { Host } from 'maverick.js/element';

import { MenuButton } from '../../../components';

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
export class MediaMenuButtonElement extends Host(HTMLElement, MenuButton) {
  static tagName = 'media-menu-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu-button': MediaMenuButtonElement;
  }
}
