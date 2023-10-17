import { Host } from 'maverick.js/element';

import { Radio } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/radio}
 * @example
 * ```html
 * <media-radio-group value="720">
 *   <media-radio value="1080">1080p</media-radio>
 *   <media-radio value="720">720p</media-radio>
 *   <!-- ... -->
 * </media-radio-group>
 * ```
 */
export class MediaRadioElement extends Host(HTMLElement, Radio) {
  static tagName = 'media-radio';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-radio': MediaRadioElement;
  }
}
