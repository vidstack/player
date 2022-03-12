import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaVisibilityElement } from '../media/manage/MediaVisibilityElement.js';

safelyDefineCustomElement('vds-media-visibility', MediaVisibilityElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-visibility': MediaVisibilityElement;
  }
}
