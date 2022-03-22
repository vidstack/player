import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaElement } from '../media/MediaElement';

safelyDefineCustomElement('vds-media', MediaElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media': MediaElement;
  }
}
