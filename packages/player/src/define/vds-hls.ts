import { safelyDefineCustomElement } from '@vidstack/foundation';

import { HlsElement } from '../providers/hls/HlsElement.js';

safelyDefineCustomElement('vds-hls', HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls': HlsElement;
  }
}
