import { Host } from 'maverick.js/element';

import { AudioGainRadioGroup } from '../../../components/ui/menu/radio-groups/audio-gain-radio-group';
import { renderMenuItemsTemplate } from './_template';

/**
 * @part label - Contains the audio gain option label.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/audio-gain-group}
 * @example
 * ```html
 * <media-menu>
 *   <!-- ... -->
 *   <media-menu-items>
 *     <media-audio-gain-radio-group>
 *       <template>
 *         <media-radio>
 *           <span data-part="label"></span>
 *         </media-radio>
 *       </template>
 *     </media-audio-gain-radio-group>
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MediaAudioGainRadioGroupElement extends Host(HTMLElement, AudioGainRadioGroup) {
  static tagName = 'media-audio-gain-radio-group';

  protected onConnect(): void {
    renderMenuItemsTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-gain-radio-group': MediaAudioGainRadioGroupElement;
  }
}
