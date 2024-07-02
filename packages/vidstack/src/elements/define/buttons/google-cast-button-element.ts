import { Host } from 'maverick.js/element';

import { GoogleCastButton } from '../../../components/ui/buttons/google-cast-button';

/**
 * @example
 * ```html
 * <media-google-cast-button>
 *   <media-icon type="chromecast"></media-icon>
 * </media-google-cast-button>
 * ```
 */
export class MediaGoogleCastButtonElement extends Host(HTMLElement, GoogleCastButton) {
  static tagName = 'media-google-cast-button';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-google-cast-button': MediaGoogleCastButtonElement;
  }
}
