import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaUiElement } from '../media/ui/MediaUiElement.js';

safelyDefineCustomElement('vds-media-ui', MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-ui': MediaUiElement;
  }
}
