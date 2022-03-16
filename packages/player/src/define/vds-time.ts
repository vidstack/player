import { safelyDefineCustomElement } from '@vidstack/foundation';

import { TimeElement } from '../ui/time/TimeElement';

safelyDefineCustomElement('vds-time', TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time': TimeElement;
  }
}
