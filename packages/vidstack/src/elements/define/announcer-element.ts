import { Host } from 'maverick.js/element';

import { MediaAnnouncer } from '../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/announcer}
 * @example
 * ```html
 * <media-announcer></media-announcer>
 * ```
 */
export class MediaAnnouncerElement extends Host(HTMLElement, MediaAnnouncer) {
  static tagName = 'media-announcer';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-announcer': MediaAnnouncerElement;
  }
}
