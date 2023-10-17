import { Host } from 'maverick.js/element';

import { Controls } from '../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/controls}
 * @example
 * ```html
 * <media-player>
 *   <!-- ... -->
 *   <media-controls>
 *     <media-controls-group></media-controls-group>
 *     <media-controls-group></media-controls-group>
 *   </media-controls>
 * </media-player>
 * ```
 */
export class MediaControlsElement extends Host(HTMLElement, Controls) {
  static tagName = 'media-controls';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-controls': MediaControlsElement;
  }
}
