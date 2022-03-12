import { safelyDefineCustomElement } from '@vidstack/foundation';

import { FullscreenButtonElement } from '../ui/fullscreen-button/FullscreenButtonElement.js';

safelyDefineCustomElement('vds-fullscreen-button', FullscreenButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fullscreen-button': FullscreenButtonElement;
  }
}
