import { Host } from 'maverick.js/element';

import { Gesture } from '../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/gesture}
 * @example
 * ```html
 * <media-player>
 *   <media-provider>
 *     <media-gesture event="pointerup" action="toggle:paused"></media-gesture>
 *   </media-provider>
 * </media-player>
 * ```
 */
export class MediaGestureElement extends Host(HTMLElement, Gesture) {
  static tagName = 'media-gesture';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-gesture': MediaGestureElement;
  }
}
