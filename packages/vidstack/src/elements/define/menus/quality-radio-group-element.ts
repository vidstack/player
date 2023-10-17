import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { QualityRadioGroup, type QualityRadioOption } from '../../../components';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the quality option label.
 * @part bitrate - Contains the quality option bitrate.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/quality-menu}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-items>
 *     <media-quality-radio-group>
 *       <template>
 *         <media-radio>
 *           <span data-part="label"></span>
 *           <span data-part="bitrate"></span>
 *         </media-radio>
 *       </template>
 *     </media-quality-radio-group>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaQualityRadioGroupElement extends Host(HTMLElement, QualityRadioGroup) {
  static tagName = 'media-quality-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this, (el, option) => {
      const bitrate = (option as QualityRadioOption).bitrate,
        bitrateEl = el.querySelector('[data-part="bitrate"]');
      if (bitrate && bitrateEl) {
        effect(() => {
          bitrateEl.textContent = bitrate() || '';
        });
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-quality-radio-group': MediaQualityRadioGroupElement;
  }
}
