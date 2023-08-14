import { Host } from 'maverick.js/element';
import { MenuButton } from '../../../components';
import { StateController } from '../../state-controller';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
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

  protected onConnect() {
    new StateController(this, () => {
      const isExpanded = this.expanded;
      return { open: !isExpanded, close: isExpanded };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-menu-button': MediaMenuButtonElement;
  }
}
