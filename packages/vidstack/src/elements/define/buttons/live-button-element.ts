import { Host } from 'maverick.js/element';

import { LiveButton } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/buttons/live-button}
 * @example
 * ```html
 * <media-live-button>
 *   <!-- ... -->
 * </media-live-button>
 * ```
 */
export class MediaLiveButtonElement extends Host(HTMLElement, LiveButton) {
  static tagName = 'media-live-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-live-button': MediaLiveButtonElement;
  }
}
