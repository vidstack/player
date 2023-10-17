import { Host } from 'maverick.js/element';

import { AudioRadioGroup } from '../../../components';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the audio track option label.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/audio-menu}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-items>
 *     <media-audio-radio-group>
 *       <template>
 *         <media-radio>
 *           <span data-part="label"></span>
 *         </media-radio>
 *       </template>
 *     </media-audio-radio-group>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaAudioRadioGroupElement extends Host(HTMLElement, AudioRadioGroup) {
  static tagName = 'media-audio-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-radio-group': MediaAudioRadioGroupElement;
  }
}
