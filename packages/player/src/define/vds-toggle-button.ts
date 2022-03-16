import { safelyDefineCustomElement } from '@vidstack/foundation';

import { ToggleButtonElement } from '../ui/toggle-button/ToggleButtonElement';

safelyDefineCustomElement('vds-toggle-button', ToggleButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-toggle-button': ToggleButtonElement;
  }
}
