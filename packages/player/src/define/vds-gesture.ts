import { safelyDefineCustomElement } from '@vidstack/foundation';

import { GestureElement } from '../ui/gesture/GestureElement';

safelyDefineCustomElement('vds-gesture', GestureElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-gesture': GestureElement;
  }
}
