import { safelyDefineCustomElement } from '@vidstack/foundation';

import { TimeElement } from '../ui/time/TimeElement.js';

safelyDefineCustomElement('vds-time', TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time': TimeElement;
  }
}
