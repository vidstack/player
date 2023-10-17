import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { Time } from '../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/time}
 * @example
 * ```html
 * <media-time type="current"></media-time>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <media-time type="current" remainder></media-time>
 * ```
 */
export class MediaTimeElement extends Host(HTMLElement, Time) {
  static tagName = 'media-time';

  protected onConnect() {
    effect(() => {
      this.textContent = this.$state.timeText();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-time': MediaTimeElement;
  }
}
