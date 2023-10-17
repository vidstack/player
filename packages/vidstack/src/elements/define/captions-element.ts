import { Host } from 'maverick.js/element';

import { Captions } from '../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/captions}
 * @example
 * ```html
 * <media-captions></media-captions>
 * ```
 */
export class MediaCaptionsElement extends Host(HTMLElement, Captions) {
  static tagName = 'media-captions';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-captions': MediaCaptionsElement;
  }
}
