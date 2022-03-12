import { safelyDefineCustomElement } from '@vidstack/foundation';

import { VideoElement } from '../providers/video/VideoElement.js';

safelyDefineCustomElement('vds-video', VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoElement;
  }
}
