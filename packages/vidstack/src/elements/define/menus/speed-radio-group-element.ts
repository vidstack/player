import { Host } from 'maverick.js/element';

import { SpeedRadioGroup } from '../../../components/ui/menu/radio-groups/speed-radio-group';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the speed option label.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/speed-radio-group}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-items>
 *     <media-speed-radio-group>
 *       <template>
 *         <media-radio>
 *           <span data-part="label"></span>
 *         </media-radio>
 *       </template>
 *     </media-speed-radio-group>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaSpeedRadioGroupElement extends Host(HTMLElement, SpeedRadioGroup) {
  static tagName = 'media-speed-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-speed-radio-group': MediaSpeedRadioGroupElement;
  }
}
