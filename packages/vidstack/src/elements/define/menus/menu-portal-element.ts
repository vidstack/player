import { Host } from 'maverick.js/element';

import { MenuPortal } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu#portal}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-portal>
 *     <media-menu-items></media-menu-items>
 *   </media-menu-portal>
 * </media-menu>
 * ```
 */
export class MediaMenuPortalElement extends Host(HTMLElement, MenuPortal) {
  static tagName = 'media-menu-portal';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu-portal': MediaMenuPortalElement;
  }
}
