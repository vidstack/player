import { safelyDefineCustomElement } from '@vidstack/foundation';

import { AudioElement } from '../providers/audio/AudioElement.js';

safelyDefineCustomElement('vds-audio', AudioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}
