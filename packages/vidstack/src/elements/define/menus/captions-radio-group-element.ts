import { Host } from 'maverick.js/element';

import { CaptionsRadioGroup } from '../../../components';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the caption/subtitle option label.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/captions-menu-items}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-items>
 *     <media-captions-radio-group>
 *       <template>
 *         <media-radio>
 *           <span data-part="label"></span>
 *         </media-radio>
 *       </template>
 *     </media-captions-radio-group>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaCaptionsRadioGroupElement extends Host(HTMLElement, CaptionsRadioGroup) {
  static tagName = 'media-captions-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-captions-radio-group': MediaCaptionsRadioGroupElement;
  }
}
