import { Host } from 'maverick.js/element';

import { ControlsGroup } from '../../components';

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
export class MediaControlsGroupElement extends Host(HTMLElement, ControlsGroup) {
  static tagName = 'media-controls-group';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-controls-group': MediaControlsGroupElement;
  }
}
