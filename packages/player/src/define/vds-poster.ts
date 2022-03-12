import { safelyDefineCustomElement } from '@vidstack/foundation';

import { PosterElement } from '../ui/poster/PosterElement.js';

safelyDefineCustomElement('vds-poster', PosterElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-poster': PosterElement;
  }
}
