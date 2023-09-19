import { Host } from 'maverick.js/element';

import { ToggleButton } from '../../../components';

/**
 * @example
 * ```html
 * <media-toggle-button aria-label="...">
 *   <!-- ... -->
 * </media-toggle-button>
 * ```
 */
export class MediaToggleButtonElement extends Host(HTMLElement, ToggleButton) {
  static tagName = 'media-toggle-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-toggle-button': MediaToggleButtonElement;
  }
}
