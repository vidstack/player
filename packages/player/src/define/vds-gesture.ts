import { safelyDefineCustomElement } from '@vidstack/foundation';

import { GestureElement } from '../ui/gesture/GestureElement.js';

safelyDefineCustomElement('vds-gesture', GestureElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-gesture': GestureElement;
  }
}
