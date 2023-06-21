import { Host } from 'maverick.js/element';

import { CaptionButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-caption-button>
 *   <media-icon type="closed-captions-on" data-state="on"></media-icon>
 *   <media-icon type="closed-captions" data-state="off"></media-icon>
 * </media-caption-button>
 * ```
 */
export class MediaCaptionButtonElement extends Host(HTMLElement, CaptionButton) {
  static tagName = 'media-caption-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-caption-button': MediaCaptionButtonElement;
  }
}
